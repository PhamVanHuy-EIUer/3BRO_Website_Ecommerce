"use client";

import { productService } from "@/services/product.service";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Search, X } from "lucide-react";
import { Image, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { Product } from "@/models/Product";
import { ApiResponse } from "@/models/ApiResponse";

const ProductsTable = () => {
  const PAGE_SIZE = 8;
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const getFirstImage = (imageUrl?: string) => {
    if (!imageUrl) return "/blank.jpg";

    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://localhost:7041${imageUrl}`;
  };

  const fetchProducts = async () => {
    const response = await productService.getProducts(page, PAGE_SIZE);
    if (response.isSuccess) {
      const data: Product[] = response.list;
      setProducts(data);
      setTotal(response.totalElement ?? 0);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;

    // Call your delete API here
    // await productService.deleteProduct(selectedProduct.id);

    console.log("Deleting product:", selectedProduct);

    // Remove from local state
    setProducts(products.filter((p) => p.id !== selectedProduct.id));
    setTotal(total - 1);

    // Close modal
    setDeleteModal(false);
    setSelectedProduct(null);
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

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
            // preview={false}
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
      render: (status: number) => <Tag color="green">Active</Tag>,
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
            onClick={() => {
              console.log("Edit", record);
            }}
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
            onClick={() => {
              console.log("Delete", record);
              handleDeleteClick(record);
            }}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];

  return (
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
      <AnimatePresence>
        {deleteModal && selectedProduct && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-50"
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
              {/* Header */}
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

              {/* Product Info */}
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
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductsTable;
