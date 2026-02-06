using Azure.Core;
using Ecommerce3BRO.Data;
using Ecommerce3BRO.DTO;
using Ecommerce3BRO.Helper;
using Ecommerce3BRO.Helper.Enums;
using Ecommerce3BRO.Model;
using Ecommerce3BRO.Service;
using Microsoft.EntityFrameworkCore;


namespace Ecommerce3BRO.Repository.Implement
{
    public class ProductRepository : IProductRepository
    {
        private readonly Ecommerce3BROContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IProductImageRepository _image;
        private readonly IDiscountRepository _discount;
        private readonly ShopLocation _shop;
        public ProductRepository(Ecommerce3BROContext context, IWebHostEnvironment env, IHttpContextAccessor _http, IProductImageRepository image, IDiscountRepository discount, ShopLocation shopLocation)
        {
            _context = context;
            _env = env;
            _image = image;
            _discount = discount;
            _shop = shopLocation;
        }

        public async Task<ApiResponse<GetProductDTO>> AddNewProductAsync(ProductDTO dto, IFormFile image)
        {
            //if (image == null || image.Length == 0)
            //{
            //    return new ApiResponse<GetProductDTO>(null, null, "400", "Please upload image", false, 0, 0, 0, 0, null, null, null);
            //}
            var findProduct = await _context.Product.FirstOrDefaultAsync(p => p.ProductName == dto.ProductName && p.Status != 0);
            if (findProduct != null)
            {
                return new ApiResponse<GetProductDTO>(null, null, "400", "Product name already exists", false, 0, 0, 0, 0, null, null, null);
            }
            var categoryExists = await _context.Category.AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
            {
                return new ApiResponse<GetProductDTO>(null, null, "400", "Category not exist", false, 0, 0, 0, 0, null, null, null);
            }
            string? imageUrl = null;

            if (image != null)
            {
                var ext = Path.GetExtension(image.FileName).ToLower();
                var allowExt = new[] { ".png", ".jpg", ".jpeg", ".webp" };

                if (!allowExt.Contains(ext))
                    return new ApiResponse<GetProductDTO>(null, null, "400", "Image is invalid", false, 0, 0, 0, 0, null, null, null);

                var folderPath = Path.Combine(
                    _env.WebRootPath,
                    "images",
                    "products"
                );

                Directory.CreateDirectory(folderPath);

                var fileName = $"{Guid.NewGuid()}{ext}";
                var fullPath = Path.Combine(folderPath, fileName);

                using var stream = new FileStream(fullPath, FileMode.Create);
                await image.CopyToAsync(stream);
                imageUrl = $"/images/products/{fileName}";
            }
            var product = new Product
            {
                Id = Guid.NewGuid(),
                ProductName = dto.ProductName,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                CategoryId = dto.CategoryId,
                ImageUrl = imageUrl,
                Status = 1,
                CreatedDate = DateTime.UtcNow
            };

            await _context.Product.AddAsync(product);
            GetProductDTO getProductDTO = new GetProductDTO
            {
                Id = product.Id,
                ProductName = product.ProductName,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                CategoryName = (await _context.Category.FindAsync(product.CategoryId))!.CategoryName,
                ImageUrl = product.ImageUrl,
                Status = product.Status
            };
            await _context.SaveChangesAsync();
            return new ApiResponse<GetProductDTO>(null, getProductDTO, "200", "Create product successfully", true, 0, 0, 0, 0, null, null, null);

        }

        public async Task<ApiResponse<GetProductDTO>> DeleteProductAsync(Guid id)
        {
            var find = await _context.Product.FindAsync(id);
            if (find == null)
            {
                return new ApiResponse<GetProductDTO>(null, null, "404", "Product not found", false, 0, 0, 0, 0, null, null, null);
            }
            find.Status = 0;
            if (!string.IsNullOrEmpty(find.ImageUrl))
            {
                var oldImagePath = Path.Combine(
                    _env.WebRootPath,
                    find.ImageUrl.TrimStart('/')
                );

                if (File.Exists(oldImagePath))
                    File.Delete(oldImagePath);
            }
            var productImageList = await _context.ProductImage.Where(pi => pi.ProductId == find.Id).ToListAsync();
            foreach (var e in productImageList)
            {
                await _image.RemoveImageFromProductAsync(e.Id);
            }
            await _context.SaveChangesAsync();
            return new ApiResponse<GetProductDTO>(null, null, "200", "Delete product successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetProductByAdminDTO>> GetAllProductByPageAsync(int currentPage, int pageSize)
        {
            if (currentPage <= 0) currentPage = 1;
            if (pageSize <= 0) pageSize = 10;
            var totalItems = _context.Product.Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var products = await _context.Product.Where(p => p.Status != 0)
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedDate)
                .Skip((currentPage - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new GetProductByAdminDTO
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.CategoryName,
                    ImageUrl = p.ImageUrl,
                    Status = p.Status
                })
                .ToListAsync();
            return new ApiResponse<GetProductByAdminDTO>(products, null, "200", "Get products by pages successfully", true, currentPage, pageSize, totalPages, totalItems, null, null, null);
        }

        public async Task<ApiResponse<GetProductDTO>> GetAvailableProductsAsync()
        {
            var products = await _context.Product.Where(p => p.Status == 1).Include(p => p.Category).Include(p=>p.Reviews).
                Select(p => new GetProductDTO
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.CategoryName,
                    ImageUrl = p.ImageUrl,
                    Status = p.Status,
                    Rating =(int)Math.Ceiling(p.Reviews.Average(p => p.Rating)),
                    TotalReviews = p.Reviews.Count()
                }).ToListAsync();
            return new ApiResponse<GetProductDTO>(products, null, "200", "Get all products successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetOrderProductDTO>> GetMostOrderedProductByPages(int currentPage, int pageSize)
        {
            if (currentPage <= 0) currentPage = 1;
            if (pageSize <= 0) pageSize = 10;
            var totalItems = _context.Product.Where(p => p.Status == 1).Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var products = await _context.Product
                .Where(p => p.Status == 1)
                .Include(p => p.Category)
                .OrderByDescending(p => p.OrderDetails.Sum(od => od.Quantity))
                .ThenBy(p => p.ProductName)
                .Skip((currentPage - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new GetOrderProductDTO
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.CategoryName,
                    ImageUrl = p.ImageUrl,
                    OrderQuantity = p.OrderDetails.Sum(od => od.Quantity),
                    Rating = (int)Math.Ceiling(p.Reviews.Average(p => p.Rating)),
                    TotalReviews = p.Reviews.Count()
                })
                .ToListAsync();
            return new ApiResponse<GetOrderProductDTO>(products, null, "200", "Get products by pages successfully", true, currentPage, pageSize, totalPages, totalItems, null, null, null);
        }

        public async Task<ApiResponse<GetProductDTO>> GetProductByAscendingPrice()
        {
            var products = await _context.Product.Where(p => p.Status == 1)
                 .Include(p => p.Category)
                 .OrderBy(p => p.Price).ThenBy(p => p.ProductName)
                 .Select(p => new GetProductDTO
                 {
                     Id = p.Id,
                     ProductName = p.ProductName,
                     Description = p.Description,
                     Price = p.Price,
                     Stock = p.Stock,
                     CategoryName = p.Category.CategoryName,
                     ImageUrl = p.ImageUrl,
                     Status = p.Status,
                     Rating = (int)Math.Ceiling(p.Reviews.Average(p => p.Rating)),
                     TotalReviews = p.Reviews.Count()
                 }).ToListAsync();
            return new ApiResponse<GetProductDTO>(products, null, "200", "Get products by ascending price successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetProductDTO>> GetProductByCategoryByPageAsync(Guid categoryId, int currentPage, int pageSize)
        {
            var findCategory = await _context.Category.FindAsync(categoryId);
            if (findCategory == null)
            {
                return new ApiResponse<GetProductDTO>(null, null, "404", "Category not found", false, 0, 0, 0, 0, null, null, null);
            }
            if (currentPage <= 0) currentPage = 1;
            if (pageSize <= 0) pageSize = 10;
            var totalItems = _context.Product.Where(p => p.Status == 1 && p.CategoryId == categoryId).Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var products = await _context.Product
                .Where(p => p.CategoryId == categoryId && p.Status == 1)
                .Include(p => p.Category).
                OrderByDescending(p => p.CreatedDate)
                .Skip((currentPage - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new GetProductDTO
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.CategoryName,
                    ImageUrl = p.ImageUrl,
                    Status = p.Status,
                    Rating = (int)Math.Ceiling(p.Reviews.Average(p => p.Rating)),
                    TotalReviews = p.Reviews.Count()
                }).ToListAsync();
            return new ApiResponse<GetProductDTO>(products, null, "200", "Get products by category successfully", true, currentPage, pageSize, totalPages, totalItems, null, null, null);
        }

        public async Task<ApiResponse<GetProductDTO>> GetProductByCategoryIdAsync(Guid categoryId)
        {
            var findCategory = await _context.Category.FindAsync(categoryId);
            if (findCategory == null)
            {
                return new ApiResponse<GetProductDTO>(null, null, "404", "Category not found", false, 0, 0, 0, 0, null, null, null);
            }
            var products = await _context.Product
                .Where(p => p.CategoryId == categoryId && p.Status == 1)
                .Include(p => p.Category)
                .Select(p => new GetProductDTO
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.CategoryName,
                    ImageUrl = p.ImageUrl,
                    Status = p.Status,
                    Rating = (int)Math.Ceiling(p.Reviews.Average(p => p.Rating)),
                    TotalReviews = p.Reviews.Count()
                }).ToListAsync();
            return new ApiResponse<GetProductDTO>(products, null, "200", "Get products by category successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetProductDTO>> GetProductByIdAsync(Guid id)
        {
            var find = await _context.Product
                .Where(p => p.Id == id && p.Status != 0)
                .Include(p => p.Category)
                .Select(p => new GetProductDTO
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.CategoryName,
                    ImageUrl = p.ImageUrl,
                    Status = p.Status,
                    Rating = (int)Math.Ceiling(p.Reviews.Average(p => p.Rating)),
                    TotalReviews = p.Reviews.Count()
                })
                .FirstOrDefaultAsync();
            if (find == null)
            {
                return new ApiResponse<GetProductDTO>(null, null, "404", "Product not found", false, 0, 0, 0, 0, null, null, null);
            }
            return new ApiResponse<GetProductDTO>(null, find, "200", "Get product by id successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<GetProductDTO>> GetProductByPages(int currentPage, int pageSize)
        {
            if (currentPage <= 0) currentPage = 1;
            if (pageSize <= 0) pageSize = 10;
            var totalItems = _context.Product.Where(p => p.Status != 0).Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var products = await _context.Product
                .Where(p => p.Status == 1)
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedDate)
                .Skip((currentPage - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new GetProductDTO
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.CategoryName,
                    ImageUrl = p.ImageUrl,
                    Status = p.Status,
                    Rating = (int)Math.Ceiling(p.Reviews.Average(p => p.Rating)),
                    TotalReviews = p.Reviews.Count()
                })
                .ToListAsync();
            return new ApiResponse<GetProductDTO>(products, null, "200", "Get products by pages successfully", true, currentPage, pageSize, totalPages, totalItems, null, null, null);
        }

        public async Task<ApiResponse<GetProductDTO>> GetProductByPriceRange(decimal minPrice, decimal maxPrice)
        {
            var products = await _context.Product
                .Where(p => p.Price >= minPrice && p.Price <= maxPrice && p.Status != 0)
                .Include(p => p.Category)
                .Select(p => new GetProductDTO
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.CategoryName,
                    ImageUrl = p.ImageUrl,
                    Status = p.Status,
                    Rating = (int)Math.Ceiling(p.Reviews.Average(p => p.Rating)),
                    TotalReviews = p.Reviews.Count()
                }).ToListAsync();
            return new ApiResponse<GetProductDTO>(products, null, "200", "Get products by price range successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<ShowCheckoutDTO>> GetProductWithAutoDiscountByCartItemListId(List<Guid> cartItemId, Guid userId)
        {
            var findUser = await _context.User.FindAsync(userId);
            if (findUser == null)
            {
                return new ApiResponse<ShowCheckoutDTO>(null, null, "401", "Unauthorized", false, 0, 0, 0, 0, null, null, null);
            }
            var findLocation = await _context.UserLocation.FirstOrDefaultAsync(l => l.UserId == findUser.Id && l.IsActive);
            decimal shippingFee = CountShippingFee.CountFee((double)_shop.Latitude, (double)_shop.Longitude, (double)findLocation.Latitude, (double)findLocation.Longitude);
            var findCartItems = await _context.CartItem.Include(ci => ci.Cart).Include(ci => ci.Product).ThenInclude(p => p.Category).Where(ci => cartItemId.Contains(ci.Id) && ci.Cart.UserId == userId).ToListAsync();
            Console.WriteLine(findCartItems.Count);
            if (!findCartItems.Any())
            {
                return new ApiResponse<ShowCheckoutDTO>(null, null, "404", "Cart item not found", false, 0, 0, 0, 0, null, null, null);
            }
            decimal totalPrice = 0;

            var productList = new List<DiscountProductDTO>();
            foreach (var item in findCartItems)
            {
                totalPrice += item.Product.Price * item.Quantity;
                productList.Add(new DiscountProductDTO
                {
                    ProductId = item.ProductId,
                    ProductName = item.Product.ProductName,
                    Price = item.Product.Price,
                    Quantity = item.Quantity,
                    CategoryName = item.Product.Category.CategoryName,
                    ImageUrl = item.Product.ImageUrl
                });
            }
            var validDiscounts = await _context.Discount.Where(d => d.StartDate <= DateTime.UtcNow && d.EndDate >= DateTime.UtcNow && d.MinOrderAmount <= totalPrice && d.IsActive).ToListAsync();
            if (!validDiscounts.Any())
            {
                var productWithoutDiscount = findCartItems.Select(ci => new DiscountProductDTO
                {
                    ProductId = ci.Product.Id,
                    ProductName = ci.Product.ProductName,
                    Price = ci.Product.Price,
                    Quantity = ci.Quantity,
                    CategoryName = ci.Product.Category.CategoryName,
                    ImageUrl = ci.Product.ImageUrl
                });
                var showCheckoutWithoutDiscount = new ShowCheckoutDTO
                {
                    productList = (List<DiscountProductDTO>)productWithoutDiscount,
                    Vouchers = null,
                    UserPhoneNumber = findUser.Phone,
                    UserFullName = findUser.FullName,
                    UserAddress = findUser.Address,
                    CurrentTotalPrice = totalPrice,
                    DiscountCode = null,
                    DiscountPrice = 0,
                    FinalTotalPrice = totalPrice + shippingFee,
                    ShippingFee = shippingFee
                };
                return new ApiResponse<ShowCheckoutDTO>(null, showCheckoutWithoutDiscount, "200", "Get products with auto discount successfully", true, 0, 0, 0, 0, null, null, null);
            }
            decimal maxDiscount = 0;
            string discountCode = null;
            foreach (var d in validDiscounts)
            {
                decimal discountValue = 0;

                //if (d.DiscountPercent.HasValue)
                //    discountValue = totalPrice * d.DiscountPercent.Value / 100;
                if (d.DiscountPercent.HasValue)
                {
                    decimal calculatedValue = totalPrice * d.DiscountPercent.Value / 100;

                    if (d.MaxDiscountAmount.HasValue)
                    {
                        // Lấy min giữa (giá trị tính theo %) và (mức trần)
                        discountValue = Math.Min(calculatedValue, d.MaxDiscountAmount.Value);
                    }
                    else
                    {
                        discountValue = calculatedValue;
                    }
                }

                if (d.DiscountAmount.HasValue)
                    discountValue = Math.Max(discountValue, d.DiscountAmount.Value);

                discountValue = Math.Min(discountValue, totalPrice);

                if (discountValue > maxDiscount)
                {
                    maxDiscount = discountValue;
                    discountCode = d.Code;
                }
            }
            var checkoutWithDiscount = new ShowCheckoutDTO
            {
                productList = productList,
                Vouchers = await _discount.GetDiscountByUser(totalPrice),
                DiscountPrice = maxDiscount,
                ShippingFee = shippingFee,
                CurrentTotalPrice = totalPrice,
                FinalTotalPrice = totalPrice - maxDiscount + shippingFee,
                DiscountCode = discountCode,
                UserAddress = findUser.Address,
                UserFullName = findUser.FullName,
                UserPhoneNumber = findUser.Phone
            };
            return new ApiResponse<ShowCheckoutDTO>(null, checkoutWithDiscount, "200", "Get product with discount successfully", true, 0, 0, 0, 0, null, null, null);


        }

        public async Task<ApiResponse<ShowCheckoutDTO>> GetProductWithAutoDiscountById(Guid productId, int quantity, Guid userId)
        {
            var findUser = await _context.User.FindAsync(userId);
            if (findUser == null)
            {
                return new ApiResponse<ShowCheckoutDTO>(null, null, "401", "Unauthorized", false, 0, 0, 0, 0, null, null, null);
            }
            var findProduct = await _context.Product.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == productId);
            if (findProduct == null)
            {
                return new ApiResponse<ShowCheckoutDTO>(null, null, "404", "Product not found", false, 0, 0, 0, 0, null, null, null);
            }
            var findLocation = await _context.UserLocation.FirstOrDefaultAsync(l => l.UserId == findUser.Id && l.IsActive);
            decimal shippingFee = CountShippingFee.CountFee((double)_shop.Latitude, (double)_shop.Longitude, (double)findLocation.Latitude, (double)findLocation.Longitude);
            decimal totalPrice = findProduct.Price * quantity + shippingFee;
            var validDiscounts = await _context.Discount.Where(d => d.StartDate <= DateTime.UtcNow && d.EndDate >= DateTime.UtcNow && d.MinOrderAmount <= totalPrice && d.IsActive).ToListAsync();
            if (!validDiscounts.Any())
            {
                var productWithoutDiscount = new DiscountProductDTO
                {
                    ProductId = findProduct.Id,
                    ProductName = findProduct.ProductName,
                    Price = findProduct.Price,
                    Quantity = quantity,
                    CategoryName = findProduct.Category.CategoryName,
                    ImageUrl = findProduct.ImageUrl,

                };
                var showCheckoutWithoutDiscount = new ShowCheckoutDTO
                {
                    Vouchers = null,
                    UserPhoneNumber = findUser.Phone,
                    UserFullName = findUser.FullName,
                    UserAddress = findUser.Address,
                    CurrentTotalPrice = totalPrice,
                    DiscountCode = null,
                    DiscountPrice = 0,
                    FinalTotalPrice = totalPrice + shippingFee,
                    ShippingFee = shippingFee
                };
                showCheckoutWithoutDiscount.productList.Add(productWithoutDiscount);
                return new ApiResponse<ShowCheckoutDTO>(null, showCheckoutWithoutDiscount, "200", "Get product with auto discount successfully", true, 0, 0, 0, 0, null, null, null);
            }
            decimal maxDiscount = 0;
            string discountCode = null;

            foreach (var d in validDiscounts)
            {
                decimal discountValue = 0;

                //if (d.DiscountPercent.HasValue)
                //    discountValue = totalPrice * d.DiscountPercent.Value / 100;

                if (d.DiscountPercent.HasValue)
                {
                    decimal calculatedValue = totalPrice * d.DiscountPercent.Value / 100;

                    if (d.MaxDiscountAmount.HasValue)
                    {
                        // Lấy min giữa (giá trị tính theo %) và (mức trần)
                        discountValue = Math.Min(calculatedValue, d.MaxDiscountAmount.Value);
                    }
                    else
                    {
                        discountValue = calculatedValue;
                    }
                }

                if (d.DiscountAmount.HasValue)
                    discountValue = Math.Max(discountValue, d.DiscountAmount.Value);

                discountValue = Math.Min(discountValue, totalPrice);

                if (discountValue > maxDiscount)
                {
                    maxDiscount = discountValue;
                    discountCode = d.Code;
                }
            }

            var productWithDiscount = new DiscountProductDTO
            {
                ProductId = findProduct.Id,
                ProductName = findProduct.ProductName,
                Price = findProduct.Price,
                Quantity = quantity,
                CategoryName = findProduct.Category.CategoryName,
                ImageUrl = findProduct.ImageUrl
            };
            var showCheckoutWithDiscount = new ShowCheckoutDTO
            {
                Vouchers = await _discount.GetDiscountByUser(totalPrice),
                DiscountPrice = maxDiscount,
                ShippingFee = shippingFee,
                CurrentTotalPrice = totalPrice,
                FinalTotalPrice = totalPrice - maxDiscount + shippingFee,
                DiscountCode = discountCode,
                UserAddress = findUser.Address,
                UserFullName = findUser.FullName,
                UserPhoneNumber = findUser.Phone
            };
            showCheckoutWithDiscount.productList.Add(productWithDiscount);
            return new ApiResponse<ShowCheckoutDTO>(null, showCheckoutWithDiscount, "200", "Get product with auto discount successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<ShowCheckoutDTO>> GetProductWithDiscountByCartItemId(CheckoutCartItemRequestDTO request, Guid userId)
        {
            var findUser = await _context.User.FindAsync(userId);
            if (findUser == null)
            {
                return new ApiResponse<ShowCheckoutDTO>(null, null, "401", "Unauthorized", false, 0, 0, 0, 0, null, null, null);
            }
            var findLocation = await _context.UserLocation.FirstOrDefaultAsync(l => l.UserId == findUser.Id && l.IsActive);
            decimal shippingFee = CountShippingFee.CountFee((double)_shop.Latitude, (double)_shop.Longitude, (double)findLocation.Latitude, (double)findLocation.Longitude);
            var findCartItems = await _context.CartItem.Include(ci => ci.Cart).Include(ci => ci.Product).ThenInclude(p => p.Category).Where(ci => request.CartItemIds.Contains(ci.Id) && ci.Cart.UserId == userId).ToListAsync();
            Console.WriteLine(findCartItems.Count);
            if (!findCartItems.Any())
            {
                return new ApiResponse<ShowCheckoutDTO>(null, null, "404", "Cart item not found", false, 0, 0, 0, 0, null, null, null);
            }
            decimal totalPrice = 0;

            var productList = new List<DiscountProductDTO>();
            foreach (var item in findCartItems)
            {
                totalPrice += item.Product.Price * item.Quantity;
                productList.Add(new DiscountProductDTO
                {
                    ProductId = item.ProductId,
                    ProductName = item.Product.ProductName,
                    Price = item.Product.Price,
                    Quantity = item.Quantity,
                    CategoryName = item.Product.Category.CategoryName,
                    ImageUrl = item.Product.ImageUrl
                });
            }

            decimal discountPrice = 0;

            var findDiscount = await _context.Discount.FirstOrDefaultAsync(d => d.Code == request.DiscountCode && d.IsActive);

            if(findDiscount == null)
            {
                return new ApiResponse<ShowCheckoutDTO>(null, null, "404", "Discount not found", false, 0, 0, 0, 0, null, null, null);
            }
            //if (findDiscount.DiscountPercent.HasValue)
            //    {
            //        discountPrice = totalPrice * findDiscount.DiscountPercent.Value/100m;
            //    }

            //    if(findDiscount.DiscountAmount.HasValue)
            //    {
            //        discountPrice = Math.Max(discountPrice, findDiscount.DiscountAmount.Value);
            //    }

            //    discountPrice = Math.Min(discountPrice, totalPrice);

            //
            if (findDiscount.DiscountPercent.HasValue)
            {
                decimal calculatedValue = totalPrice * findDiscount.DiscountPercent.Value / 100m;

                if (findDiscount.MaxDiscountAmount.HasValue)
                {
                    discountPrice = Math.Min(calculatedValue, findDiscount.MaxDiscountAmount.Value);
                }
                else
                {
                    discountPrice = calculatedValue;
                }
            }

            if (findDiscount.DiscountAmount.HasValue)
            {
                discountPrice = Math.Max(discountPrice, findDiscount.DiscountAmount.Value);
            }

            discountPrice = Math.Min(discountPrice, totalPrice); //
            var checkout = new ShowCheckoutDTO
            {
                productList = productList,
                //Vouchers = await _discount.GetDiscountByUser(totalPrice),
                CurrentTotalPrice = totalPrice,
                DiscountPrice = discountPrice,
                ShippingFee = shippingFee,
                FinalTotalPrice = totalPrice - discountPrice + shippingFee,
                DiscountCode = findDiscount.Code,
                UserAddress = findUser.Address,
                UserFullName = findUser.FullName,
                UserPhoneNumber = findUser.Phone,
            };
            return new ApiResponse<ShowCheckoutDTO>(null, checkout, "200", "Get product with discount successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<ShowCheckoutDTO>> GetProductWithDiscountById(Guid productId, int quantity, Guid userId, string discountCode)
        {
            var findUser = await _context.User.FindAsync(userId);
            var findDiscount = await _context.Discount.FirstOrDefaultAsync(d => d.Code == discountCode);
            var findProduct = await _context.Product.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == productId);
            var findLocation = await _context.UserLocation.FirstOrDefaultAsync(l => l.UserId == findUser.Id && l.IsActive);
            decimal shippingFee = CountShippingFee.CountFee((double)_shop.Latitude, (double)_shop.Longitude, (double)findLocation.Latitude, (double)findLocation.Longitude);
            var productWithDiscount = new DiscountProductDTO
            {
                ProductId = findProduct.Id,
                ProductName = findProduct.ProductName,
                Price = findProduct.Price,
                Quantity = quantity,
                CategoryName = findProduct.Category.CategoryName,
                ImageUrl = findProduct.ImageUrl
            };
            decimal totalPrice = findProduct.Price * quantity + shippingFee;
            decimal discountPrice = 0;

            if (findDiscount != null)
            {
                //if (findDiscount.DiscountPercent.HasValue)
                //{
                //    discountPrice = totalPrice * findDiscount.DiscountPercent.Value / 100;
                //}
                //if (findDiscount.DiscountAmount.HasValue)
                //{
                //    discountPrice = Math.Max(discountPrice, findDiscount.DiscountAmount.Value);
                //}
                //discountPrice = Math.Min(discountPrice, totalPrice);

                //
                if (findDiscount.DiscountPercent.HasValue)
                {
                    decimal calculatedValue = totalPrice * findDiscount.DiscountPercent.Value / 100m;

                    if (findDiscount.MaxDiscountAmount.HasValue)
                    {
                        discountPrice = Math.Min(calculatedValue, findDiscount.MaxDiscountAmount.Value);
                    }
                    else
                    {
                        discountPrice = calculatedValue;
                    }
                }

                if (findDiscount.DiscountAmount.HasValue)
                {
                    discountPrice = Math.Max(discountPrice, findDiscount.DiscountAmount.Value);
                }

                discountPrice = Math.Min(discountPrice, totalPrice); //
            }

            var checkoutWithDiscount = new ShowCheckoutDTO
            {
                Vouchers = await _discount.GetDiscountByUser(totalPrice),
                DiscountPrice = discountPrice,
                ShippingFee = shippingFee,
                CurrentTotalPrice = totalPrice,
                FinalTotalPrice = totalPrice - discountPrice + shippingFee,
                DiscountCode = discountCode,
                UserAddress = findUser.Address,
                UserFullName = findUser.FullName,
                UserPhoneNumber = findUser.Phone
            };
            checkoutWithDiscount.productList.Add(productWithDiscount);
            return new ApiResponse<ShowCheckoutDTO>(null, checkoutWithDiscount, "200", "Get product with discount successfully", true, 0, 0, 0, 0, null, null, null);
        }

        public async Task<ApiResponse<TopProductDTO>> GetTopProducts(int pageSize)
        {
            var products = await _context.Product.Where(p => p.Status == 1).OrderByDescending(p => p.OrderDetails.Sum(od => od.Quantity) * p.Price).ThenBy(p => p.ProductName).Take(pageSize).Select(p => new TopProductDTO
            {
                productId = p.Id,
                productName = p.ProductName,
                totalRevenue = p.OrderDetails.Sum(od => od.Quantity) * p.Price,
            }).ToListAsync();
            return new ApiResponse<TopProductDTO>(products, null, "200", "Get products by pages successfully", true, 0, pageSize, 0, 0, null, null, null);

        }

        public async Task<ApiResponse<GetProductDTO>> SearchProductByPageAsync(string keyword, int currentPage, int pageSize)
        {
            if (keyword == null)
            {
                return new ApiResponse<GetProductDTO>(null, null, "400", "Keyword is required", false, 0, 0, 0, 0, null, null, null);
            }
            if (currentPage <= 0) currentPage = 1;
            if (pageSize <= 0) pageSize = 10;

            keyword = keyword.Trim().ToLower();

            var query = _context.Product
                .Where(p =>
                    p.Status != 0 &&
                    (p.ProductName.ToLower().Contains(keyword)
                     || p.Category.CategoryName.ToLower().Contains(keyword)))
                .Include(p => p.Category);

            var totalItems = await query.CountAsync();

            var products = await query
                .OrderBy(p => p.Id) 
                .Skip((currentPage - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new GetProductDTO
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category.CategoryName,
                    ImageUrl = p.ImageUrl,
                    Status = p.Status,
                    Rating = (int)Math.Ceiling(p.Reviews.Average(p => p.Rating)),
                    TotalReviews = p.Reviews.Count()
                })
                .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            return new ApiResponse<GetProductDTO>(products, null, "200", "Search products by page successfully", true, currentPage, pageSize, totalPages, totalItems, null, null, null);
        }

        //public async Task<ApiResponse<GetProductDTO>> SearchProductsAsync(string keyword)
        //{
        //    //if(keyword == null)
        //    //{
        //    //    return new ApiResponse<GetProductDTO>(null, null, "400", "Keyword is required", fale, 0, 0, 0, 0, null, null, null);
        //    //}
        //    keyword = keyword.Trim().ToLower();
        //    var findBooks = await _context.Product
        //        .Where(p => (p.ProductName.ToLower().Contains(keyword) || p.Category.CategoryName.ToLower().Contains(keyword)) && p.Status == 1)
        //        .Include(p => p.Category)
        //        .Select(p => new GetProductDTO
        //        {
        //            Id = p.Id,
        //            ProductName = p.ProductName,
        //            Description = p.Description,
        //            Price = p.Price,
        //            Stock = p.Stock,
        //            CategoryName = p.Category.CategoryName,
        //            ImageUrl = p.ImageUrl
        //        }).ToListAsync();
        //    return new ApiResponse<GetProductDTO>(findBooks, null, "200", "Search products successfully", true, 0, 0, 0, 0, null, null, null);
        //}

        public async Task<ApiResponse<GetProductDTO>> UpdateProductAsync(Guid id, ProductDTO product, IFormFile? newImage)
        {
            var findProduct = await _context.Product.FindAsync(id);
            if (findProduct == null)
            {
                return new ApiResponse<GetProductDTO>(null, null, "404", "Product not found", false, 0, 0, 0, 0, null, null, null);
            }
            findProduct.ProductName = product.ProductName;
            findProduct.Description = product.Description;
            findProduct.Price = product.Price;
            findProduct.Stock = product.Stock;
            findProduct.CategoryId = product.CategoryId;
            if (newImage != null)
            {
                var ext = Path.GetExtension(newImage.FileName).ToLower();
                var allowExt = new[] { ".png", ".jpg", ".jpeg", ".webp" };
                if (!allowExt.Contains(ext))
                    return new ApiResponse<GetProductDTO>(null, null, "400", "Image is invaid", false, 0, 0, 0, 0, null, null, null);
                var folderPath = Path.Combine(
                    _env.WebRootPath,
                    "images",
                    "products"
                );
                if (!string.IsNullOrEmpty(findProduct.ImageUrl))
                {
                    var oldImagePath = Path.Combine(
                        _env.WebRootPath,
                        findProduct.ImageUrl.TrimStart('/')
                    );

                    if (File.Exists(oldImagePath))
                        File.Delete(oldImagePath);
                }
                Directory.CreateDirectory(folderPath);
                var fileName = $"{Guid.NewGuid()}{ext}";
                var fullPath = Path.Combine(folderPath, fileName);
                using var stream = new FileStream(fullPath, FileMode.Create);
                await newImage.CopyToAsync(stream);
                findProduct.ImageUrl = $"/images/products/{fileName}";

            }
            await _context.SaveChangesAsync();
            var name = await _context.Category.FirstOrDefaultAsync(c => c.Id == findProduct.CategoryId);
            var updatedProductWithImage = new GetProductDTO
            {
                Id = findProduct.Id,
                ProductName = findProduct.ProductName,
                Description = findProduct.Description,
                Price = findProduct.Price,
                Stock = findProduct.Stock,
                CategoryName = name.CategoryName,
                ImageUrl = findProduct.ImageUrl,
                Status = findProduct.Status
            };
            return new ApiResponse<GetProductDTO>(null, updatedProductWithImage, "200", "Update product successfully with new image", true, 0, 0, 0, 0, null, null, null);

        }

        public async Task<ApiResponse<GetProductDTO>> UpdateProductStatus(Guid productId, int status)
        {
            var findProduct = await _context.Product.FindAsync(productId);
            if (findProduct == null)
            {
                return new ApiResponse<GetProductDTO>(null, null, "404", "Product not found", false, 0, 0, 0, 0, null, null, null);
            }
            findProduct.Status = status;
            await _context.SaveChangesAsync();
            return new ApiResponse<GetProductDTO>(null, null, "200", "Update product status successfully", true, 0, 0, 0, 0, ((ProductStatus)status).ToString(), null, null);
        }
    }
}
