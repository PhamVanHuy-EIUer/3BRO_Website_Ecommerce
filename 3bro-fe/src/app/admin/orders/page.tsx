"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Table,
  Card,
  Tag,
  Space,
  Button,
  Input,
  Select,
  notification,
  Modal,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { orderService } from "@/services/order.service";
import { Order } from "@/models/Order";
import { OrderDetail } from "@/models/OrderDetail";
import {
  EyeOutlined,
  SearchOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TruckOutlined,
  BankOutlined,
  EditOutlined,
  SaveOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { ApiResponse } from "@/models/ApiResponse";

const { Search } = Input;
const { Option } = Select;

enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Shipping = 2,
  Completed = 3,
  Cancelled = 4,
}

const statusConfig = {
  [OrderStatus.Pending]: {
    label: "Pending",
    color: "warning",
    icon: <ClockCircleOutlined />,
  },
  [OrderStatus.Confirmed]: {
    label: "Confirmed",
    color: "processing",
    icon: <BankOutlined />,
  },
  [OrderStatus.Shipping]: {
    label: "Shipping",
    color: "purple",
    icon: <TruckOutlined />,
  },
  [OrderStatus.Completed]: {
    label: "Completed",
    color: "success",
    icon: <CheckCircleOutlined />,
  },
  [OrderStatus.Cancelled]: {
    label: "Cancelled",
    color: "error",
    icon: <CloseCircleOutlined />,
  },
};

const AdminOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [total, setTotal] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data: ApiResponse<Order> = await orderService.getOrderByAdmin();
      setOrders(data.list);
      setTotal(data.list.length);
      return data.list;
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchOrders();
  }, []);

  if (!mounted) return null;

  const handleViewDetail = async (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
    setLoadingDetail(true);
    setEditingStatus(false);
    setSelectedStatus(parseInt(order.status));

    try {
      const details: ApiResponse<OrderDetail> =
        await orderService.getOrderDetail(order.orderId);
      setOrderDetails(details.list);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setOrderDetails([]);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || selectedStatus === null) return;

    try {
      setUpdatingStatus(true);
      const res: ApiResponse<any> = await orderService.updateStatusOrder(
        selectedOrder.orderId,
        selectedStatus,
      );
      if (!res.isSuccess || res.code !== "200") {
        api.error({
          title: "Error",
          description:
            res.message || "An error occurred while updating status!",
          duration: 2,
        });
        return;
      }
      const updatedOrders = await fetchOrders();
      const updatedOrder = updatedOrders.find(
        (o) => o.orderId === selectedOrder.orderId,
      );

      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }

      setEditingStatus(false);
      api.success({
        title: "Success",
        description: res.message || "Status updated successfully!",
        duration: 2,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      api.error({
        title: "Error",
        description: "An error occurred while updating status!",
        duration: 2,
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setOrderDetails([]);
    setEditingStatus(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getFirstImage = (imageUrl?: string) => {
    if (!imageUrl) return "/blank.jpg";
    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://localhost:7041${imageUrl}`;
  };

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Pending",
      value: orders.filter((o) => o.status === "Pending").length,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Completed",
      value: orders.filter((o) => o.status === "Completed").length,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Cancelled",
      value: orders.filter((o) => o.status === "Cancelled").length,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productNames.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Table columns
  const columns: ColumnsType<Order> = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      width: 150,
      render: (orderId: string) => (
        <span className="font-medium text-blue-600 font-mono text-sm">
          #{orderId.slice(0, 8)}
        </span>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-400" />
          <span className="font-medium">{name}</span>
        </div>
      ),
    },
    {
      title: "Products",
      dataIndex: "productNames",
      key: "productNames",
      ellipsis: true,
      width: 250,
    },
    {
      title: "Quantity",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right",
      render: (amount: number) => (
        <span className="font-semibold text-gray-900">{amount}</span>
      ),
    },
    {
      title: "Refund",
      dataIndex: "refundPrice",
      key: "refundPrice",
      width: 150,
      align: "right",
      render: (refundPrice: number) => (
        <span className="font-semibold text-red-600">
          {formatCurrency(refundPrice)}
        </span>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "netRevenue",
      key: "netRevenue",
      width: 150,
      align: "right",
      render: (netRevenue: number) => (
        <span className="font-bold text-green-600">
          {formatCurrency(netRevenue)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => {
        const statusNum = parseInt(status);
        const config = statusConfig[statusNum as OrderStatus];
        return (
          <Tag icon={config?.icon} color={config?.color} className="px-3 py-1">
            {config?.label || status}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mx-auto mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold bg-linear-to-r bg-clip-text text-black">
                    Order Management
                  </h1>
                  <p className="text-slate-600 mt-1">Total {total} orders</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}
                >
                  <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                size="large"
                className="w-full sm:w-64"
              >
                <Option value="all">All Orders</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Confirmed">Confirmed</Option>
                <Option value="Shipping">Shipping</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </div>

            {/* Table */}
            <Card>
              <Table
                columns={columns}
                dataSource={filteredOrders}
                rowKey="orderId"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} orders`,
                }}
                scroll={{ x: 1200 }}
              />
            </Card>
          </motion.div>
        </div>

        {/* Modal */}

        <Modal
          title={
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BankOutlined className="text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold">Order Details</div>
                <div className="text-sm text-gray-500 font-mono">
                  #{selectedOrder?.orderId.slice(0, 8)}
                </div>
              </div>
            </div>
          }
          open={showModal}
          onCancel={closeModal}
          footer={null}
          width={1000}
          centered
        >
          {selectedOrder && (
            <div className="mt-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <UserOutlined className="text-blue-600" />
                    <p className="text-sm text-gray-600 font-medium">
                      Customer
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">
                    {selectedOrder.customerName}
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarOutlined className="text-green-600" />
                    <p className="text-sm text-gray-600 font-medium">Total</p>
                  </div>
                  <p className="font-bold text-green-600 text-xl">
                    {formatCurrency(selectedOrder.netRevenue)}
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingOutlined className="text-purple-600" />
                    <p className="text-sm text-gray-600 font-medium">
                      Quantity
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">
                    {selectedOrder.amount}
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CloseCircleOutlined className="text-red-600" />
                    <p className="text-sm text-gray-600 font-medium">Refund</p>
                  </div>
                  <p className="font-bold text-red-600 text-lg">
                    {formatCurrency(selectedOrder.refundPrice)}
                  </p>
                </div>
              </div>

              {/* Status Section */}
              {/* Status Section */}
              <div className="mb-6 p-6 rounded-xl border border-blue-100 bg-blue-50/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <ClockCircleOutlined className="text-blue-600" />
                    Order Status
                  </h3>
                  {!editingStatus && (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setEditingStatus(true)}
                      className="flex items-center gap-2 px-6 h-10 bg-blue-600 hover:bg-blue-700 border-none shadow-sm transition-transform active:scale-95"
                    >
                      Edit Status
                    </Button>
                  )}
                </div>

                {!editingStatus ? (
                  <div className="flex items-center">
                    {(() => {
                      const statusNum = parseInt(selectedOrder.status);
                      const config = statusConfig[statusNum as OrderStatus];
                      return (
                        <Tag
                          icon={config?.icon}
                          color={config?.color}
                          className="px-4 py-2 text-base rounded-lg flex items-center gap-2 w-fit border-0"
                        >
                          {config?.label || selectedOrder.status}
                        </Tag>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        OrderStatus.Pending,
                        OrderStatus.Confirmed,
                        OrderStatus.Shipping,
                        OrderStatus.Completed,
                        OrderStatus.Cancelled,
                      ].map((status) => {
                        const config = statusConfig[status];
                        const isSelected = selectedStatus === status;
                        const isCurrent =
                          parseInt(selectedOrder.status) === status;

                        return (
                          <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            type="button"
                            className={`
                            relative p-4 rounded-xl border-2 text-left transition-all duration-200 group
                            ${
                              isSelected
                                ? "border-blue-600 bg-blue-50 shadow-md transform scale-[1.02]"
                                : isCurrent
                                  ? "border-gray-300 bg-gray-50 opacity-60"
                                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                            }
                          `}
                          >
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                              <div
                                className={`
                              text-lg transition-colors
                              ${isSelected ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"}
                            `}
                              >
                                {config.icon}
                              </div>
                              <span
                                className={`
                                font-medium text-sm
                                ${isSelected ? "text-blue-700" : "text-gray-600 group-hover:text-gray-900"}
                              `}
                              >
                                {config.label}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-2 right-2 text-blue-600">
                                <CheckCircleOutlined />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-blue-100 mt-4">
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleUpdateStatus}
                        loading={updatingStatus}
                        disabled={
                          selectedStatus === parseInt(selectedOrder.status)
                        }
                        size="large"
                        className="bg-green-600 hover:bg-green-700 min-w-[140px]"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingStatus(false);
                          setSelectedStatus(parseInt(selectedOrder.status));
                        }}
                        size="large"
                        className="hover:bg-gray-100"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Products List */}
              <div>
                <h3 className="font-bold mb-4 text-gray-900 text-lg flex items-center gap-2">
                  <BankOutlined className="text-blue-600" />
                  Products in Order
                </h3>

                {loadingDetail ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">
                      Loading details...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderDetails.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <BankOutlined className="text-5xl text-gray-400 mb-3" />
                        <p className="text-gray-500 font-medium">
                          No products found
                        </p>
                      </div>
                    ) : (
                      orderDetails.map((item) => (
                        <div
                          key={item.orderItemId}
                          className="flex gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-300 transition-all duration-200 bg-white"
                        >
                          <img
                            src={getFirstImage(item.imageUrl)}
                            alt={item.productName}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-2">
                              {item.productName}
                            </h4>
                            <div className="flex flex-col gap-1">
                              <p className="text-sm text-gray-600">
                                Unit Price:{" "}
                                <span className="font-semibold text-gray-900">
                                  {formatCurrency(item.price)}
                                </span>
                              </p>
                              <p className="text-sm font-bold text-blue-600">
                                Total: {formatCurrency(item.totalPrice)}
                              </p>
                            </div>
                          </div>
                          {item.isReturn && (
                            <Tag color="error" className="h-fit">
                              Returned
                            </Tag>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default AdminOrder;
