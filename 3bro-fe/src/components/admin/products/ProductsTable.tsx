"use client";

import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Search, X, ImagePlus } from "lucide-react";
import {
  Image,
  notification,
  Space,
  Table,
  Tag,
  Input,
  InputNumber,
  Select,
  Upload as AntUpload,
} from "antd";
import type { UploadFile, UploadProps } from "antd";
import { ColumnsType } from "antd/es/table";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

const { TextArea } = Input;

const ProductsTable = () => {
  const PAGE_SIZE = 8;
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [api, contextHolder] = notification.useNotification();

  // Image upload state
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  // Form state for update
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: 0,
    stock: 0,
    imageUrl: "",
    categoryId: "",
  });

  const getFirstImage = (imageUrl?: string) => {
    if (!imageUrl) return "/blank.jpg";
    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://localhost:7041${imageUrl}`;
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProductsAdmin(
        page,
        PAGE_SIZE,
      );
      if (response.isSuccess) {
        const data: Product[] = response.list;
        setProducts(data);
        setTotal(response.totalElement ?? 0);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      api.error({
        title: "Error",
        description: "Failed to load products",
        duration: 2,
      });
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await categoryService.getCategories();
      if (response.isSuccess) {
        const activeCategories = response.list || [];
        setCategories(activeCategories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      api.error({
        title: "Error",
        description: "Failed to load categories",
        duration: 2,
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Handle Update Click
  const handleUpdateClick = async (product: Product) => {
    fetchCategories();
    if (categories.length === 0) {
      api.warning({
        title: "Please wait",
        description: "Categories are still loading...",
        duration: 2,
      });
      return;
    }

    // Find category by name (case-insensitive, trimmed)
    const currentCategory = categories.find(
      (cat) =>
        cat.categoryName.trim().toLowerCase() ===
        product.categoryName.trim().toLowerCase(),
    );

    const categoryId = currentCategory?.id || "";

    if (!currentCategory) {
      console.warn(" Category not found for product:", {
        productCategoryName: product.categoryName,
        availableCategories: categories.map((c) => c.categoryName),
      });
    } else {
      console.log("Matched category:", currentCategory);
    }

    setSelectedProduct(product);
    setFormData({
      productName: product.productName,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      categoryId: categoryId,
    });
    setPreviewImage(getFirstImage(product.imageUrl));
    setFileList([]);
    setImageFile(null);
    setUpdateModal(true);
  };

  // Handle image upload change
  const handleImageChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);

    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj as File;
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Reset when removing image
      setImageFile(null);
      if (selectedProduct) {
        setPreviewImage(getFirstImage(selectedProduct.imageUrl));
      }
    }
  };

  // Handle before upload
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      api.error({
        message: "Invalid File",
        description: "You can only upload image files!",
        duration: 2,
      });
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      api.error({
        message: "File Too Large",
        description: "Image must be smaller than 5MB!",
        duration: 2,
      });
      return false;
    }

    return false; // Prevent auto upload
  };

  // Handle Update Submit
  const handleConfirmUpdate = async () => {
    if (!selectedProduct) return;

    try {
      // Validate required fields
      if (!formData.productName || !formData.price || !formData.categoryId) {
        api.warning({
          message: "Validation Error",
          description:
            "Please fill in all required fields (Name, Price, Category)",
          duration: 2,
        });
        return;
      }

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append("ProductName", formData.productName);
      formDataToSend.append("Description", formData.description || "");
      formDataToSend.append("Price", formData.price.toString());
      formDataToSend.append("Stock", formData.stock.toString());
      formDataToSend.append("CategoryId", formData.categoryId);

      // Add image file only if new one is selected
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const res = await productService.updateProduct(
        selectedProduct.id,
        formDataToSend,
      );

      if (!res.isSuccess) throw new Error(res.message);

      api.success({
        message: "Success",
        description: res.message || "Product updated successfully",
        duration: 2,
      });

      // Close modal and reset
      setUpdateModal(false);
      setSelectedProduct(null);
      setImageFile(null);
      setFileList([]);
      setPreviewImage("");

      // Refresh data
      await fetchProducts();
    } catch (error: any) {
      api.error({
        message: "Update Failed",
        description: error.message || "Failed to update product",
        duration: 3,
      });
    }
  };

  const handleCancelUpdate = () => {
    setUpdateModal(false);
    setSelectedProduct(null);
    setImageFile(null);
    setFileList([]);
    setPreviewImage("");
  };

  // Handle Delete Click
  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      const res = await productService.deleteProduct(selectedProduct.id);
      if (!res.isSuccess) throw new Error(res.message);

      api.success({
        message: "Success",
        description: "Product deleted successfully",
        duration: 2,
      });

      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      setTotal(total - 1);
      setDeleteModal(false);
      setSelectedProduct(null);
    } catch (error: any) {
      api.error({
        message: "Delete Failed",
        description: error.message || "Failed to delete product",
        duration: 3,
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: ColumnsType<Product> = [
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      render: (text: string, record: Product) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Image
            src={getFirstImage(record.imageUrl)}
            alt={text}
            width={50}
            height={50}
            style={{ borderRadius: "8px", objectFit: "cover" }}
            fallback="/blank.jpg"
          />
          <div>
            <div style={{ fontWeight: 500, marginBottom: "4px" }}>{text}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span style={{ fontWeight: 500 }}>${price.toFixed(2)}</span>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => (
        <span
          style={{
            color: stock === 0 ? "#ff4d4f" : "inherit",
            fontWeight: stock === 0 ? 500 : 400,
          }}
        >
          {stock === 0 ? "Out of stock" : stock}
        </span>
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
      title: "Action",
      key: "action",
      render: (_, record: Product) => (
        <Space size="middle">
          <a
            style={{
              color: "#ffffff",
              cursor: "pointer",
              padding: "4px 8px",
              border: "1px solid #4990E2",
              borderRadius: "4px",
              transition: "background-color 0.3s ease, color 0.3s ease",
              backgroundColor: "#4990E2",
            }}
            onClick={() => handleUpdateClick(record)}
          >
            Update
          </a>
          <a
            style={{
              color: "#ffffff",
              cursor: "pointer",
              padding: "4px 8px",
              border: "1px solid #ff4d4f",
              borderRadius: "4px",
              transition: "background-color 0.3s ease, color 0.3s ease",
              backgroundColor: "#ff4d4f",
            }}
            onClick={() => handleDeleteClick(record)}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <motion.div
        className="relative h-auto bg-[#f5f5f5] p-5 rounded-xl flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
          <h2 className="flex-3 text-lg md:text-xl font-semibold text-gray-950 text-center md:text-left">
            Product List
          </h2>
          <div className="relative md:mx-auto text-left">
            <input
              type="text"
              placeholder="Search products..."
              className="bg-[#fefefe] placeholder-black rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:placeholder-gray-200"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <Search className="absolute left-3 top-2.5 text-black" size={18} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table<Product>
            dataSource={filteredProducts}
            columns={columns}
            pagination={{
              pageSize: PAGE_SIZE,
              showSizeChanger: false,
              placement: ["bottomCenter"],
              current: page,
              total: total,
              onChange: (newPage) => setPage(newPage),
            }}
            rowKey="id"
          />
        </div>

        {/* Update Modal */}
        <AnimatePresence>
          {updateModal && selectedProduct && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelUpdate}
            >
              <motion.div
                className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Update Product
                  </h3>
                  <button
                    onClick={handleCancelUpdate}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Product Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Product Image
                  </label>
                  <div className="flex flex-col items-center gap-4">
                    {/* Preview */}
                    <div className="relative">
                      <Image
                        src={previewImage}
                        alt={formData.productName}
                        width={200}
                        height={200}
                        style={{ borderRadius: "12px", objectFit: "cover" }}
                        preview={true}
                        fallback="/blank.jpg"
                      />
                    </div>

                    {/* Upload Button */}
                    <AntUpload
                      listType="picture"
                      fileList={fileList}
                      onChange={handleImageChange}
                      beforeUpload={beforeUpload}
                      maxCount={1}
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onRemove={() => {
                        setFileList([]);
                        setImageFile(null);
                        if (selectedProduct) {
                          setPreviewImage(
                            getFirstImage(selectedProduct.imageUrl),
                          );
                        }
                      }}
                    >
                      <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <ImagePlus size={20} />
                        <span>Change Image</span>
                      </button>
                    </AntUpload>
                    <p className="text-xs text-gray-500">
                      Supported formats: PNG, JPG, JPEG, WEBP (Max 5MB)
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter product name"
                      value={formData.productName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productName: e.target.value,
                        })
                      }
                      size="large"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <TextArea
                      placeholder="Enter product description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      size="large"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Select
                      placeholder="Select category"
                      value={formData.categoryId || undefined}
                      onChange={(value) => {
                        const selectedCategory = categories.find(
                          (c) => c.id === value,
                        );
                        setFormData({
                          ...formData,
                          categoryId: value,
                        });
                      }}
                      size="large"
                      className="w-full"
                      showSearch
                      loading={categoriesLoading}
                      disabled={categoriesLoading}
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
                      notFoundContent={
                        categoriesLoading ? "Loading..." : "No categories found"
                      }
                    />
                    {categoriesLoading && (
                      <p className="text-xs text-gray-500 mt-1">
                        Loading categories...
                      </p>
                    )}
                    {!categoriesLoading && !formData.categoryId && (
                      <p className="text-xs text-amber-600 mt-1">
                        Please select from list
                      </p>
                    )}
                  </div>

                  {/* Price and Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <InputNumber
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(value) =>
                          setFormData({ ...formData, price: value || 0 })
                        }
                        min={0}
                        step={0.01}
                        precision={2}
                        size="large"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock
                      </label>
                      <InputNumber
                        placeholder="0"
                        value={formData.stock}
                        onChange={(value) =>
                          setFormData({ ...formData, stock: value || 0 })
                        }
                        min={0}
                        size="large"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <Select
                      value={formData.status}
                      onChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                      size="large"
                      className="w-full"
                      options={[
                        { value: 1, label: "Active" },
                        { value: 0, label: "Inactive" },
                      ]}
                    />
                  </div> */}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={handleCancelUpdate}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmUpdate}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Update Product
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Modal */}
        <AnimatePresence>
          {deleteModal && selectedProduct && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelDelete}
            >
              <motion.div
                className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <AlertTriangle className="text-red-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Delete Product
                    </h3>
                  </div>
                  <button
                    onClick={handleCancelDelete}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

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
                      preview={false}
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

                <div className="flex gap-3">
                  <button
                    onClick={handleCancelDelete}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ProductsTable;
