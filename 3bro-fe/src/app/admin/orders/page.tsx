"use client";

import React, { useState, useEffect } from "react";
import { orderService } from "@/services/order.service";
import { Order } from "@/models/Order";
import { OrderDetail } from "@/models/OrderDetail";
import {
  Eye,
  X,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  Calendar,
  User,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import { ApiResponse } from "@/models/ApiResponse";

enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Shipping = 2,
  Completed = 3,
  Cancelled = 4,
}

const statusConfig = {
  [OrderStatus.Pending]: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    gradient: "from-yellow-50 to-yellow-100",
  },
  [OrderStatus.Confirmed]: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Package,
    gradient: "from-blue-50 to-blue-100",
  },
  [OrderStatus.Shipping]: {
    label: "Đang giao",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
    gradient: "from-purple-50 to-purple-100",
  },
  [OrderStatus.Completed]: {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    gradient: "from-green-50 to-green-100",
  },
  [OrderStatus.Cancelled]: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    gradient: "from-red-50 to-red-100",
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data: ApiResponse<Order> = await orderService.getOrderByAdmin();
      setOrders(data.list);
      return data.list;
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

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
      await orderService.updateStatusOrder(
        selectedOrder.orderId,
        selectedStatus,
      );
      const updatedOrders = await fetchOrders();
      const updatedOrder = updatedOrders.find(
        (o) => o.orderId === selectedOrder.orderId,
      );

      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }

      setEditingStatus(false);
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái!");
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

  const getStatusBadge = (status: string, size: "sm" | "md" = "sm") => {
    const statusNum = parseInt(status);
    const config = statusConfig[statusNum as OrderStatus];
    const Icon = config?.icon;
    const sizeClasses =
      size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm";

    return (
      <span
        className={`inline-flex items-center gap-1.5 ${sizeClasses} rounded-full font-medium border ${config?.color || "bg-gray-100 text-gray-800"}`}
      >
        {Icon && <Icon size={size === "sm" ? 14 : 16} />}
        {config?.label || status}
      </span>
    );
  };

  const getAvailableStatuses = (currentStatus: string) => {
    const current = parseInt(currentStatus);
    const statuses = [];

    if (current === OrderStatus.Pending) {
      statuses.push(OrderStatus.Confirmed, OrderStatus.Cancelled);
    } else if (current === OrderStatus.Confirmed) {
      statuses.push(OrderStatus.Shipping, OrderStatus.Cancelled);
    } else if (current === OrderStatus.Shipping) {
      statuses.push(OrderStatus.Completed, OrderStatus.Cancelled);
    }

    return statuses;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ShoppingBag className="text-blue-600" size={32} />
                Quản lý Đơn hàng
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Package size={16} />
                Tổng số đơn hàng:{" "}
                <span className="font-semibold text-blue-600">
                  {orders.length}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Hệ thống quản lý</p>
              <p className="text-lg font-semibold text-gray-900">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Hoàn trả
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <Package
                        className="mx-auto mb-3 text-gray-400"
                        size={48}
                      />
                      <p className="text-gray-500 font-medium">
                        Không có đơn hàng nào
                      </p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          #{order.orderId.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-900 font-medium">
                            {order.customerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {order.productNames}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                        {formatCurrency(order.refundPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-green-600 font-bold">
                          {formatCurrency(order.netRevenue)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                        >
                          <Eye size={16} />
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5 flex items-center justify-between rounded-t-2xl shadow-lg z-10">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Package size={28} />
                Chi tiết đơn hàng #{selectedOrder.orderId.slice(0, 8)}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="text-blue-600" size={20} />
                    <p className="text-sm text-gray-600 font-medium">
                      Khách hàng
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">
                    {selectedOrder.customerName}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-green-600" size={20} />
                    <p className="text-sm text-gray-600 font-medium">
                      Tổng tiền
                    </p>
                  </div>
                  <p className="font-bold text-green-600 text-xl">
                    {formatCurrency(selectedOrder.netRevenue)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="text-purple-600" size={20} />
                    <p className="text-sm text-gray-600 font-medium">
                      Số tiền sản phẩm
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">
                    {formatCurrency(selectedOrder.amount)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="text-red-600" size={20} />
                    <p className="text-sm text-gray-600 font-medium">
                      Hoàn trả
                    </p>
                  </div>
                  <p className="font-bold text-red-600 text-lg">
                    {formatCurrency(selectedOrder.refundPrice)}
                  </p>
                </div>
              </div>

              {/* Status Section */}
              <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <Clock size={20} className="text-blue-600" />
                    Trạng thái đơn hàng
                  </h3>
                  {!editingStatus && (
                    <button
                      onClick={() => setEditingStatus(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                    >
                      <Edit2 size={16} />
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                {!editingStatus ? (
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedOrder.status, "md")}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(statusConfig).map(([key, config]) => {
                        const statusNum = parseInt(key);
                        const Icon = config.icon;
                        const isSelected = selectedStatus === statusNum;
                        const isCurrent =
                          parseInt(selectedOrder.status) === statusNum;

                        return (
                          <button
                            key={key}
                            onClick={() => setSelectedStatus(statusNum)}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              isSelected
                                ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
                                : isCurrent
                                  ? "border-gray-300 bg-gray-50"
                                  : "border-gray-200 bg-white hover:border-gray-400"
                            }`}
                          >
                            <div className="flex items-center gap-2 justify-center">
                              <Icon
                                size={18}
                                className={isSelected ? "text-blue-600" : ""}
                              />
                              <span
                                className={`font-medium text-sm ${isSelected ? "text-blue-600" : "text-gray-700"}`}
                              >
                                {config.label}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleUpdateStatus}
                        disabled={
                          updatingStatus ||
                          selectedStatus === parseInt(selectedOrder.status)
                        }
                        className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          updatingStatus ||
                          selectedStatus === parseInt(selectedOrder.status)
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl"
                        }`}
                      >
                        <Save size={18} />
                        {updatingStatus ? "Đang lưu..." : "Lưu thay đổi"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingStatus(false);
                          setSelectedStatus(parseInt(selectedOrder.status));
                        }}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Products List */}
              <div>
                <h3 className="font-bold mb-4 text-gray-900 text-lg flex items-center gap-2">
                  <Package className="text-blue-600" size={20} />
                  Sản phẩm trong đơn hàng
                </h3>

                {loadingDetail ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">
                      Đang tải chi tiết...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderDetails.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <Package
                          className="mx-auto mb-3 text-gray-400"
                          size={48}
                        />
                        <p className="text-gray-500 font-medium">
                          Không có sản phẩm
                        </p>
                      </div>
                    ) : (
                      orderDetails.map((item) => (
                        <div
                          key={item.orderItemId}
                          className="flex gap-4 p-4 border-2 border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-300 transition-all duration-200 bg-white"
                        >
                          <img
                            src={getFirstImage(item.imageUrl)}
                            alt={item.productName}
                            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg mb-2">
                              {item.productName}
                            </h4>
                            <div className="flex flex-col gap-1">
                              <p className="text-sm text-gray-600">
                                Đơn giá:{" "}
                                <span className="font-semibold text-gray-900">
                                  {formatCurrency(item.price)}
                                </span>
                              </p>
                              <p className="text-sm font-bold text-blue-600">
                                Tổng: {formatCurrency(item.totalPrice)}
                              </p>
                            </div>
                          </div>
                          {item.isReturn && (
                            <span className="px-4 py-2 bg-red-100 text-red-800 border border-red-200 rounded-lg text-sm font-bold h-fit shadow-sm">
                              Đã hoàn trả
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrder;
