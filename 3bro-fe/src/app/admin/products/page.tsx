"use client";

import React, { useState, useEffect } from "react";
import { productService } from "@/services/product.service";
import { Product } from "@/models/Product";
import { ProductImage } from "@/models/ProductImage";
import {
  Trash2,
  Edit,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Search,
  Eye,
} from "lucide-react";
import { categoryService } from "@/services/category.service";
import { ApiResponse } from "@/models/ApiResponse";
import { Category } from "@/models/Category";
import { Select } from "antd";

export default function ProductAdmin() {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form states for Add Product
  const [newProduct, setNewProduct] = useState({
    productName: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<
    string[]
  >([]);

  const getFirstImage = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return "/blank.jpg";

    // Nếu đã là URL đầy đủ (http hoặc https), trả về trực tiếp
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // Nếu là đường dẫn tương đối, thêm base URL
    // Đảm bảo không có dấu / kép
    const baseUrl = "https://localhost:7041";
    const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `${baseUrl}${path}`;
  };

  // Form states for Edit Product
  const [editProduct, setEditProduct] = useState({
    productName: "",
    description: "",
    price: "",
    stock: "",
    categoryName: "",
    categoryId: "",
  });
  const [editMainImage, setEditMainImage] = useState<File | null>(null);
  const [editMainImagePreview, setEditMainImagePreview] = useState<string>("");
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [newProductImages, setNewProductImages] = useState<File[]>([]);
  const [newProductImagePreviews, setNewProductImagePreviews] = useState<
    string[]
  >([]);

  // Load data
  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [currentPage, searchKeyword]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response: ApiResponse<Product> = searchKeyword
        ? await productService.searchProduct(
            searchKeyword,
            currentPage,
            pageSize,
          )
        : await productService.getAllProductsAdmin(currentPage, pageSize);
      setProducts(response.list);
      setTotalPages(response.totalPage || 1);
    } catch (error) {
      console.error("Error loading products:", error);
      alert("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const data: ApiResponse<Category> = await categoryService.getCategories();
      setCategories(data.list);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Handle main image upload
  const handleMainImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isEdit) {
        setEditMainImage(file);
        setEditMainImagePreview(URL.createObjectURL(file));
      } else {
        setMainImage(file);
        setMainImagePreview(URL.createObjectURL(file));
      }
    }
  };

  // Handle additional images upload
  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    setAdditionalImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setAdditionalImagePreviews((prev) => [...prev, ...previews]);
  };

  // Handle new product images for edit
  const handleNewProductImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    setNewProductImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewProductImagePreviews((prev) => [...prev, ...previews]);
  };

  // Remove additional image
  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove new product image
  const removeNewProductImage = (index: number) => {
    setNewProductImages((prev) => prev.filter((_, i) => i !== index));
    setNewProductImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Delete product image
  const deleteProductImage = async (imageId: string) => {
    try {
      await productService.deleteImageProduct(imageId);
      setProductImages((prev) => prev.filter((img) => img.id !== imageId));
      alert("Xóa ảnh thành công!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Không thể xóa ảnh. Vui lòng thử lại.");
    }
  };

  // Add new product
  const handleAddProduct = async () => {
    if (!mainImage) {
      alert("Vui lòng chọn ảnh chính cho sản phẩm!");
      return;
    }

    if (
      !newProduct.productName ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.categoryId
    ) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm!");
      return;
    }

    const formData = new FormData();
    formData.append("productName", newProduct.productName);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    formData.append("categoryId", newProduct.categoryId);
    formData.append("mainImage", mainImage);

    try {
      const response = await productService.addProduct(formData);

      // Add additional images if any
      if (additionalImages.length > 0) {
        await productService.addImagesForProduct(response.id, additionalImages);
      }

      // Reset form
      setNewProduct({
        productName: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
      });
      setMainImage(null);
      setAdditionalImages([]);
      setMainImagePreview("");
      setAdditionalImagePreviews([]);
      setShowAddModal(false);

      alert("Thêm sản phẩm thành công!");
      loadProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Không thể thêm sản phẩm. Vui lòng thử lại.");
    }
  };

  // Update product
  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    if (
      !editProduct.productName ||
      !editProduct.price ||
      !editProduct.stock ||
      !editProduct.categoryId
    ) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm!");
      return;
    }

    const formData = new FormData();
    formData.append("productName", editProduct.productName);
    formData.append("description", editProduct.description);
    formData.append("price", editProduct.price);
    formData.append("stock", editProduct.stock);
    formData.append("categoryId", editProduct.categoryId);

    if (editMainImage) {
      formData.append("mainImage", editMainImage);
    }

    try {
      await productService.updateProduct(selectedProduct.id, formData);

      // Add new images if any
      if (newProductImages.length > 0) {
        await productService.addImagesForProduct(
          selectedProduct.id,
          newProductImages,
        );
      }

      setShowEditModal(false);
      setSelectedProduct(null);
      setEditMainImage(null);
      setNewProductImages([]);
      setNewProductImagePreviews([]);

      alert("Cập nhật sản phẩm thành công!");
      loadProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Không thể cập nhật sản phẩm. Vui lòng thử lại.");
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await productService.deleteProduct(selectedProduct.id);
      setShowDeleteModal(false);
      setSelectedProduct(null);

      alert("Xóa sản phẩm thành công!");
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Không thể xóa sản phẩm. Vui lòng thử lại.");
    }
  };

  // Open edit modal
  const openEditModal = async (product: Product) => {
    setSelectedProduct(product);
    setEditProduct({
      productName: product.productName,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      categoryName: product.categoryName || "",
      categoryId: product.categoryId || "",
    });
    setEditMainImagePreview(product.imageUrl);
    setEditMainImage(null);

    try {
      const images: ApiResponse<ProductImage> =
        await productService.getImageProduct(product.id);
      setProductImages(images.list);
    } catch (error) {
      console.error("Error loading product images:", error);
    }

    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Quản Lý Sản Phẩm
              </h1>
              <p className="text-slate-600 mt-1">
                Tổng số {products.length} sản phẩm
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Plus size={20} />
              Thêm Sản Phẩm
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Ảnh
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Tên Sản Phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Danh Mục
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Tồn Kho
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-600">Đang tải...</p>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-slate-600">Không có sản phẩm nào</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={getFirstImage(product.imageUrl)}
                          alt={product.productName}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {product.productName}
                        </div>
                        <div className="text-sm text-slate-600 line-clamp-1">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                          {product.categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">
                          {product.price.toLocaleString("vi-VN")}đ
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            product.stock > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            product.status === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.status === 1 ? "Hoạt động" : "Ngừng bán"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Trang {currentPage} / {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-slate-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-slate-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 flex items-center gap-3 rounded-t-2xl">
              <div className="p-3 bg-white/20 rounded-full">
                <Plus size={24} />
              </div>
              <h2 className="text-2xl font-bold">Thêm Sản Phẩm Mới</h2>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tên Sản Phẩm *
                </label>
                <input
                  type="text"
                  value={newProduct.productName}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      productName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mô Tả
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Nhập mô tả sản phẩm"
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Giá *
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Số Lượng *
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Danh Mục *
                </label>
                <select
                  value={newProduct.categoryId}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, categoryId: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Main Image */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ảnh Chính *
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-500 transition-colors">
                  {mainImagePreview ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={mainImagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 mb-2">
                          {mainImage?.name}
                        </p>
                        <button
                          onClick={() => {
                            setMainImage(null);
                            setMainImagePreview("");
                          }}
                          className="text-red-600 text-sm font-medium hover:underline"
                        >
                          Xóa ảnh
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <Upload size={40} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">
                        Click để chọn ảnh chính
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleMainImageChange(e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ảnh Bổ Sung
                </label>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-500 transition-colors">
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <ImageIcon size={40} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">
                        Click để thêm nhiều ảnh
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImagesChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {additionalImagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                      {additionalImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Additional ${index}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddProduct}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Thêm Sản Phẩm
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewProduct({
                      productName: "",
                      description: "",
                      price: "",
                      stock: "",
                      categoryId: "",
                    });
                    setMainImage(null);
                    setAdditionalImages([]);
                    setMainImagePreview("");
                    setAdditionalImagePreviews([]);
                  }}
                  className="px-6 py-3 border border-slate-300 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 flex items-center gap-3 rounded-t-2xl">
              <div className="p-3 bg-white/20 rounded-full">
                <Edit size={24} />
              </div>
              <h2 className="text-2xl font-bold">Chỉnh Sửa Sản Phẩm</h2>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tên Sản Phẩm *
                </label>
                <input
                  type="text"
                  value={editProduct.productName}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      productName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mô Tả
                </label>
                <textarea
                  value={editProduct.description}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Giá *
                  </label>
                  <input
                    type="number"
                    value={editProduct.price}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, price: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Số Lượng *
                  </label>
                  <input
                    type="number"
                    value={editProduct.stock}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, stock: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Danh Mục *
                </label>
                {/* <select
                  value={editProduct.categoryId}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      categoryId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select> */}
                <Select
                  placeholder="Select category"
                  value={editProduct.categoryName}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      categoryId: e.toString(),
                      categoryName: e.toString(),
                    })
                  }
                  size="large"
                  className="w-full"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.categoryName,
                  }))}
                />
              </div>

              {/* Update Main Image */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Cập Nhật Ảnh Chính
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-blue-500 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        editMainImage
                          ? editMainImagePreview
                          : getFirstImage(editMainImagePreview)
                      }
                      alt="Current"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <label className="flex-1 flex flex-col items-center gap-2 cursor-pointer p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-blue-400 transition-colors">
                      <Upload size={32} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">
                        {editMainImage
                          ? "Ảnh mới đã chọn"
                          : "Click để đổi ảnh chính"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleMainImageChange(e, true)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Current Product Images */}
              {productImages.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ảnh Hiện Tại
                  </label>
                  <div className="grid grid-cols-4 gap-4">
                    {productImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={getFirstImage(img.imageUrl)}
                          alt={img.productName}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => deleteProductImage(img.id)}
                          className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Images */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Thêm Ảnh Mới
                </label>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-500 transition-colors">
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <ImageIcon size={40} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">
                        Click để thêm nhiều ảnh
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleNewProductImagesChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {newProductImagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                      {newProductImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`New ${index}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeNewProductImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateProduct}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Cập Nhật
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setEditMainImage(null);
                    setNewProductImages([]);
                    setNewProductImagePreviews([]);
                  }}
                  className="px-6 py-3 border border-slate-300 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-5 flex items-center gap-3 rounded-t-2xl">
              <div className="p-3 bg-white/20 rounded-full">
                <Trash2 size={24} />
              </div>
              <h2 className="text-2xl font-bold">Xác Nhận Xóa</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Product Preview */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-start gap-4">
                  <img
                    src={getFirstImage(selectedProduct.imageUrl)}
                    alt={selectedProduct.productName}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 mb-1">
                      {selectedProduct.productName}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                      {selectedProduct.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-semibold text-slate-700">
                        Giá: {selectedProduct.price.toLocaleString("vi-VN")}đ
                      </span>
                      <span className="font-semibold text-slate-700">
                        Tồn: {selectedProduct.stock}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex-shrink-0">
                  <Eye size={24} className="text-red-600" />
                </div>
                <p className="text-sm text-red-800">
                  <strong>Cảnh báo:</strong> Bạn có chắc chắn muốn xóa sản phẩm
                  này? Hành động này không thể hoàn tác.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteProduct}
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Xóa Sản Phẩm
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                  }}
                  className="px-6 py-3 border border-slate-300 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
