"use client";

import React, { useState, useEffect, use } from "react";
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
import {
  DeleteColumnOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { categoryService } from "@/services/category.service";
import { ApiResponse } from "@/models/ApiResponse";
import { Category } from "@/models/Category";
import {
  notification,
  Select,
  Table,
  Card,
  Tag,
  Button,
  Input,
  Space,
  Image,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import PageLoading from "@/components/Loading";

export default function ProductAdmin() {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [api, contextHolder] = notification.useNotification();

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

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

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
  }, []);

  useEffect(() => {
    // Filter products based on search keyword
    if (searchKeyword.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  }, [searchKeyword, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Load nhiều products để client-side pagination
      const response: ApiResponse<Product> =
        await productService.getAllProductsAdmin(1, 1000);
      setProducts(response.list);
      setFilteredProducts(response.list);
    } catch (error) {
      console.error("Error loading products:", error);
      api.error({
        title: "Error",
        description: "Error loading products",
        placement: "topRight",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (selectedProduct && showEditModal) {
  //     setEditProduct({
  //       productName: selectedProduct.productName,
  //       description: selectedProduct.description || "",
  //       price: selectedProduct.price.toString(),
  //       stock: selectedProduct.stock.toString(),
  //       categoryId: selectedProduct.categoryId, // 🔥 QUAN TRỌNG
  //       categoryName: selectedProduct.categoryName ?? "",
  //     });
  //   }
  // }, [selectedProduct, showEditModal]);
  const loadCategories = async () => {
    try {
      const data: ApiResponse<Category> = await categoryService.getCategories();
      setCategories(data.list);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Define columns for Ant Design Table
  const columns: ColumnsType<Product> = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (imageUrl: string) => (
        <Image
          src={getFirstImage(imageUrl)}
          alt="Product"
          className="w-16 h-16 object-cover rounded-lg shadow-sm"
          width={50}
          height={50}
        />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      render: (text: string, record: Product) => (
        <div>
          <div className="font-semibold text-slate-900">{text}</div>
          <div className="text-sm text-slate-600 line-clamp-1">
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (text: string) => (
        <Tag color="blue" className="px-3 py-1">
          {text}
        </Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => (
        <span className="font-semibold text-slate-900">
          {price.toLocaleString("vi-VN")}đ
        </span>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
      render: (stock: number) => (
        <Tag color={stock > 0 ? "green" : "red"}>
          {stock > 0 ? `${stock}` : "Out of Stock"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (
        <Tag color={status === 1 ? "green" : "red"}>
          {status === 1 ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <span
            className="px-3 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
            onClick={() => openEditModal(record)}
          >
            <EditOutlined />
          </span>

          <span
            className="px-3 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 transition-colors"
            onClick={() => {
              setSelectedProduct(record);
              setShowDeleteModal(true);
            }}
          >
            <DeleteOutlined />
          </span>
        </Space>
      ),
    },
  ];

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
      const res: ApiResponse<any> =
        await productService.deleteImageProduct(imageId);
      setProductImages((prev) => prev.filter((img) => img.id !== imageId));
      if (res.code === "200" && res.isSuccess) {
        api.success({
          title: "Success",
          description: "Delete image successfully",
          duration: 2,
        });
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      api.error({
        title: "Error",
        description: "Cannot delete image. Please try again.",
        duration: 2,
      });
    }
  };

  // Add new product
  const handleAddProduct = async () => {
    if (!mainImage) {
      api.error({
        title: "Error",
        description: "Please upload a main image.",
        duration: 2,
      });
      return;
    }

    if (
      !newProduct.productName ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.categoryId
    ) {
      api.error({
        title: "Error",
        description: "Please fill in all required fields.",
        duration: 2,
      });
      return;
    }

    const formData = new FormData();
    formData.append("ProductName", newProduct.productName);
    formData.append("Description", newProduct.description);
    formData.append("Price", newProduct.price);
    formData.append("Stock", newProduct.stock);
    formData.append("CategoryId", newProduct.categoryId);
    formData.append("image", mainImage);

    try {
      const response: ApiResponse<Product> =
        await productService.addProduct(formData);
      const obj: any = {};
      formData.forEach((value, key) => {
        obj[key] = value;
      });
      console.log(obj);
      if (!response.isSuccess) throw new Error(response.message);
      if (additionalImages.length > 0) {
        const resImages: ApiResponse<any> =
          await productService.addImagesForProduct(
            response.object?.id ?? "",
            additionalImages,
          );
      }

      resetAddForm();
      setShowAddModal(false);
      api.success({
        title: "Success",
        description: "Add product successfully",
        duration: 2,
      });
      loadProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      api.error({
        title: "Error",
        description: `${error}`,
        duration: 2,
      });
    }
  };

  // Update product
  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    console.log(editProduct.categoryId);
    if (
      !editProduct.productName ||
      !editProduct.price ||
      !editProduct.stock ||
      !editProduct.categoryId
    ) {
      api.error({
        title: "Error",
        description: "Please fill in all required fields.",
        duration: 2,
      });
      return;
    }

    const formData = new FormData();
    formData.append("ProductName", editProduct.productName);
    formData.append("Description", editProduct.description);
    formData.append("Price", editProduct.price);
    formData.append("Stock", editProduct.stock);
    formData.append("CategoryId", editProduct.categoryId);

    if (editMainImage) {
      formData.append("image", editMainImage);
    }

    try {
      const res: ApiResponse<any> = await productService.updateProduct(
        selectedProduct.id,
        formData,
      );

      if (newProductImages.length > 0) {
        const resImages: ApiResponse<any> =
          await productService.addImagesForProduct(
            selectedProduct.id,
            newProductImages,
          );
        if (resImages.code !== "200" && !resImages.isSuccess) {
          throw new Error(resImages.message);
        }
      }

      if (res.code !== "200" && !res.isSuccess) {
        api.error({
          title: "Error",
          description: res.message,
          duration: 2,
        });
      }
      if (res.code === "200" && res.isSuccess) {
        api.success({
          title: "Success",
          description: "Update product successfully",
          duration: 2,
        });
      }

      setShowEditModal(false);
      setSelectedProduct(null);
      resetEditForm();

      loadProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      api.error({
        title: "Error",
        description: "Cannot update product. Please try again.",
        duration: 2,
      });
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await productService.deleteProduct(selectedProduct.id);
      setShowDeleteModal(false);
      setSelectedProduct(null);
      api.success({
        title: "Success",
        description: "Delete product successfully",
        duration: 2,
      });
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      api.error({
        title: "Error",
        description: "Cannot delete product. Please try again.",
        duration: 2,
      });
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
      categoryId:
        categories.find((c) => c.categoryName === product.categoryName)?.id ||
        "",
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

  const resetAddForm = () => {
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
  };

  const resetEditForm = () => {
    setEditMainImage(null);
    setNewProductImages([]);
    setNewProductImagePreviews([]);
    setProductImages([]);
  };

  return (
    <>
      {contextHolder}
      {loading ? (
        <PageLoading />
      ) : (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-50 p-6">
          {/* Header */}
          <div className="max-w-7xl mx-auto mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold bg-linear-to-r bg-clip-text text-black">
                    Product Management
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Total {filteredProducts.length} products
                  </p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 rounded-sm z-10"
                      size={20}
                    />
                    <Input
                      placeholder="Search..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="pl-10! pr-4 py-2! w-full sm:w-64"
                    />
                  </div>

                  <Button
                    type="primary"
                    icon={<Plus size={20} />}
                    onClick={() => setShowAddModal(true)}
                    size="large"
                    className="bg-linear-to-r! from-red-600! to-orange-600! rounded-sm!"
                  >
                    Add Product
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="max-w-7xl mx-auto">
            <Card className="rounded-2xl shadow-lg">
              <Table
                columns={columns}
                dataSource={filteredProducts}
                rowKey="id"
                // loading={loading}
                pagination={{
                  pageSize: pageSize,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} products`,
                  pageSizeOptions: ["5", "10", "20", "50", "100"],
                  onShowSizeChange: (current, size) => setPageSize(size),
                }}
                scroll={{ x: 1200 }}
              />
            </Card>
          </div>

          {/* Add Product Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-md shadow-2xl max-w-3xl w-full my-8">
                <div className="bg-linear-to-r from-red-600 to-rose-600 text-white px-6 py-5 flex items-center gap-3 rounded-t-md sticky top-0 z-10">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">Add New Product</h2>
                </div>

                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Product Name *
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
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                      placeholder="Enter product description"
                    />
                  </div>

                  {/* Price and Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            stock: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Category *
                    </label>
                    <Select
                      placeholder="Select category"
                      value={newProduct.categoryId}
                      onChange={(value) =>
                        setNewProduct({ ...newProduct, categoryId: value })
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

                  {/* Main Image */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Main Image *
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-500 transition-colors">
                      {mainImagePreview ? (
                        <div className="flex items-center gap-4">
                          <Image
                            src={mainImagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg"
                            width={100}
                            height={100}
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
                              Remove image
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center gap-2 cursor-pointer">
                          <Upload size={40} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-600">
                            Click to select main image
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
                      Additional Images
                    </label>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-500 transition-colors">
                        <label className="flex flex-col items-center gap-2 cursor-pointer">
                          <ImageIcon size={40} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-600">
                            Click to add multiple images
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
                              <Image
                                src={preview}
                                alt={`Additional ${index}`}
                                className="w-full h-24 object-cover rounded-lg"
                                width={80}
                                height={80}
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
                  <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-4">
                    <button
                      onClick={handleAddProduct}
                      className="flex-2 bg-linear-to-r from-red-600 to-orange-600 text-white py-3 rounded-sm font-semibold hover:shadow-lg transition-all cursor-pointer"
                    >
                      Add Product
                    </button>
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        resetAddForm();
                      }}
                      className="flex-1 px-6 py-3 border border-slate-300 rounded-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Product Modal */}
          {showEditModal && selectedProduct && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-md shadow-2xl max-w-3xl w-full my-8">
                <div className="bg-linear-to-r from-red-600 to-orange-600 text-white px-6 py-4 flex items-center gap-3 rounded-t-md sticky top-0 z-10">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Edit size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold">Edit Product</h2>
                </div>

                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Product Name *
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
                      Description
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Price and Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        value={editProduct.price}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            price: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={editProduct.stock}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            stock: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Category *
                    </label>
                    <Select
                      placeholder="Select category"
                      value={editProduct.categoryName}
                      onChange={(value) => {
                        const category = categories.find(
                          (c) => c.categoryName.toLocaleLowerCase() === value,
                        );

                        setEditProduct({
                          ...editProduct,
                          categoryId: category?.id || "",
                          categoryName: value || "",
                        });
                      }}
                      size="large"
                      className="w-full"
                      showSearch={{
                        optionFilterProp: "label",
                      }}
                      options={categories.map((cat) => ({
                        value: cat.categoryName,
                        label: cat.categoryName,
                      }))}
                    />
                  </div>

                  {/* Update Main Image */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Update Main Image
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-blue-500 transition-colors">
                      <div className="flex items-center gap-4">
                        <Image
                          src={
                            editMainImage
                              ? editMainImagePreview
                              : getFirstImage(editMainImagePreview)
                          }
                          alt="Current"
                          className="w-32 h-32 object-cover rounded-lg"
                          width={128}
                          height={128}
                        />
                        <label className="flex-1 flex flex-col items-center gap-2 cursor-pointer p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-blue-400 transition-colors">
                          <Upload size={32} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-600">
                            {editMainImage
                              ? "New image selected"
                              : "Click to change main image"}
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
                        Current Images
                      </label>
                      <div className="grid grid-cols-4 gap-4">
                        {productImages.map((img) => (
                          <div key={img.id} className="relative group">
                            <img
                              src={getFirstImage(img.imageUrl)}
                              alt={img.productName}
                              className="w-full h-24 object-cover rounded-md cursor-pointer"
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
                      Add New Images
                    </label>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-500 transition-colors">
                        <label className="flex flex-col items-center gap-2 cursor-pointer">
                          <ImageIcon size={40} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-600">
                            Click to add multiple images
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
                  <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-4">
                    <button
                      onClick={handleUpdateProduct}
                      className="flex-2 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-sm font-semibold hover:shadow-lg transition-all"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedProduct(null);
                        resetEditForm();
                      }}
                      className=" flex-1 px-6 py-3 border border-slate-300 rounded-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && selectedProduct && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-md shadow-2xl max-w-lg w-full">
                <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-5 flex items-center gap-3 rounded-t-md">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Trash2 size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">Confirm Delete</h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Product Preview */}
                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      Are you sure you want to delete this product? This action
                      cannot be undone.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                      <Image
                        src={getFirstImage(selectedProduct.imageUrl)}
                        alt={selectedProduct.productName}
                        width={60}
                        height={60}
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                        // preview={false}
                        fallback="/blank.jpg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {selectedProduct.productName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {selectedProduct.categoryName}
                        </p>
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          ${selectedProduct.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteProduct}
                      className="flex-2 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-sm font-semibold hover:shadow-lg transition-all cursor-pointer"
                    >
                      Delete Product
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 px-6 py-3 border border-slate-300 rounded-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
