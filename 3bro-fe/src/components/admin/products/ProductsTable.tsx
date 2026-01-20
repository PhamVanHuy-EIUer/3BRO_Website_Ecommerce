"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Image, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { Product } from "@/models/Product";
import { useProductManagement } from "@/hook/useProductManagement";
import { UpdateProductModal } from "./UpdateProductModal";
import { DeleteProductModal } from "./DeleteProductModal";
import { formatVND } from "@/utils/currency";
import { AddProductModal } from "./AddProductModal";

const ProductsTable = () => {
  const PAGE_SIZE = 8;
  const [search, setSearch] = useState("");

  const {
    products,
    searchedProducts,
    categories,
    categoriesLoading,
    total,
    page,
    setPage,
    deleteModal,
    setDeleteModal,
    updateModal,
    setUpdateModal,
    selectedProduct,
    setSelectedProduct,
    contextHolder,
    fileList,
    previewImage,
    formData,
    handleImageRemove,
    setFormData,
    getImageUrl,
    handleUpdateClick,
    handleAddClick,
    handleImageChange,
    beforeUpload,
    handleConfirmUpdate,
    handleConfirmDelete,
    resetModal,
    addModal,
    setAddModal,
  } = useProductManagement(PAGE_SIZE, search);

  const columns: ColumnsType<Product> = [
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      render: (text: string, record: Product) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Image
            src={getImageUrl(record.imageUrl)}
            alt={text}
            width={50}
            height={50}
            style={{ borderRadius: "8px", objectFit: "cover" }}
            fallback="/blank.jpg"
          />
          <div style={{ fontWeight: 500 }}>{text}</div>
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
        <span style={{ fontWeight: 500 }}>{formatVND(price)}</span>
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
          <button
            className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
            onClick={() => handleUpdateClick(record)}
          >
            Update
          </button>
          <button
            className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 transition-colors"
            onClick={() => {
              setSelectedProduct(record);
              setDeleteModal(true);
            }}
          >
            Delete
          </button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div>
        {addModal && (
          <AddProductModal
            isOpen={addModal}
            formData={formData}
            previewImage={previewImage}
            fileList={fileList}
            categories={categories}
            categoriesLoading={categoriesLoading}
            onClose={() => {
              resetModal();
              setAddModal(false);
            }}
            onConfirm={handleConfirmUpdate}
            onFormChange={setFormData}
            onImageChange={handleImageChange}
            onBeforeUpload={beforeUpload}
            onImageRemove={handleImageRemove}
          />
        )}
        <motion.div
          className="relative h-auto bg-[#f5f5f5] p-5 rounded-xl flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-950">
              Product List
            </h2>
            <div className="flex justify-center items-center gap-4">
              <div className="relative justify-end">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
              {!addModal && (
                <div className="flex justify-center ">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
                    onClick={() => {
                      handleAddClick();
                    }}
                  >
                    Add Product
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <Table<Product>
            dataSource={
              searchedProducts.length > 0 ? searchedProducts : products
            }
            columns={columns}
            pagination={{
              pageSize: PAGE_SIZE,
              showSizeChanger: false,
              placement: ["bottomEnd"],
              current: page,
              total: total,
              onChange: setPage,
            }}
            rowKey="id"
          />

          {/* Update Modal */}
          <UpdateProductModal
            isOpen={updateModal}
            product={selectedProduct}
            formData={formData}
            previewImage={previewImage}
            fileList={fileList}
            categories={categories}
            categoriesLoading={categoriesLoading}
            onClose={() => {
              setUpdateModal(false);
              resetModal();
            }}
            onConfirm={handleConfirmUpdate}
            onFormChange={(data) => setFormData({ ...formData, ...data })}
            onImageChange={handleImageChange}
            onBeforeUpload={beforeUpload}
            onImageRemove={handleImageRemove}
          />

          {/* Delete Modal */}
          <DeleteProductModal
            isOpen={deleteModal}
            product={selectedProduct}
            onClose={() => {
              setDeleteModal(false);
              setSelectedProduct(null);
            }}
            onConfirm={handleConfirmDelete}
            getImageUrl={getImageUrl}
          />
        </motion.div>
      </div>
    </>
  );
};

export default ProductsTable;
