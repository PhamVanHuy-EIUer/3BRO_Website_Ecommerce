"use client";
import React, { useState, useEffect } from "react";
import { orderService } from "@/services/order.service";
import type { ViewOrderUser } from "@/models/ViewOrderUser";
import { ApiResponse } from "@/models/ApiResponse";
import {
  BellIcon,
  BoxIcon,
  ChevronLeftIcon,
  SearchIcon,
  TicketIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { AuthProvider, useAuth } from "@/context/AuthContext";

type OrderStatus =
  | "All"
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Completed"
  | "Cancelled";

const OrderHistoryPage = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>("All");
  const [activeMenu, setActiveMenu] = useState("Purchase Order");
  const [orders, setOrders] = useState<ViewOrderUser[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ViewOrderUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ViewOrderUser | null>(
    null,
  );
  const { user } = useAuth();

  const getFirstImage = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return "/blank.jpg";
    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://localhost:7041${imageUrl}`;
  };

  const redColor = "text-[#DB4444]";
  const bgRed = "bg-[#DB4444]";

  const menuItems = [
    {
      name: "My Account",
      icon: <UserIcon className="w-5 h-5" />,
      subItems: ["Profile", "Address", "Change Password"],
    },
    {
      name: "Purchase Order",
      icon: <BoxIcon className="w-5 h-5" />,
      subItems: [],
    },
    {
      name: "Notifications",
      icon: <BellIcon className="w-5 h-5" />,
      subItems: ["Order Updates", "Promotions", "Wallet Updates"],
    },
    {
      name: "Voucher Wallet",
      icon: <TicketIcon className="w-5 h-5" />,
      subItems: [],
    },
  ];

  const orderTabs: OrderStatus[] = [
    "All",
    "Pending",
    "Confirmed",
    "Shipped",
    "Completed",
    "Cancelled",
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<ViewOrderUser> =
          await orderService.getOrderByUser();
        const ordersArray = Array.isArray(response.list) ? response.list : [];
        setOrders(ordersArray);
        setFilteredOrders(ordersArray);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (!Array.isArray(orders)) {
      setFilteredOrders([]);
      return;
    }

    let filtered = [...orders];

    if (activeTab !== "All") {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === activeTab.toLowerCase(),
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.productName.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    setFilteredOrders(filtered);
  }, [activeTab, searchQuery, orders]);

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "delivered":
      case "completed":
        return (
          <span className="flex items-center gap-1 text-[#00BFA5] text-sm uppercase font-medium">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className="text-[#DB4444] text-sm uppercase font-medium">
            Cancelled
          </span>
        );
      case "shipped":
        return (
          <span className="text-[#FF9800] text-sm uppercase font-medium">
            Shipped
          </span>
        );
      case "Confirmed":
        return (
          <span className="text-[#2196F3] text-sm uppercase font-medium">
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="text-[#FFC107] text-sm uppercase font-medium">
            Pending
          </span>
        );
      default:
        return (
          <span className="text-gray-600 text-sm uppercase font-medium">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const OrderDetailModal = ({ order }: { order: ViewOrderUser }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedOrder(null)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">Order Details</h2>
          </div>
          <button
            onClick={() => setSelectedOrder(null)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-bold text-lg">{order.orderId}</p>
              </div>
              <div className="text-right">{getStatusBadge(order.status)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Order Date</p>
                <p className="font-medium">{formatDate(order.createdDate)}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Items</p>
                <p className="font-medium">{order.items.length} product(s)</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-4">Products</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.orderItemId}
                  className="flex gap-4 p-4 bg-gray-50 rounded"
                >
                  <div className="w-20 h-20 bg-white border border-gray-200 flex-shrink-0 rounded overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={getFirstImage(item.imageUrl)}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <BoxIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-black font-medium mb-1">
                      {item.productName}
                    </h4>
                    <div className="flex justify-between items-end">
                      <p className="text-gray-500 text-sm">
                        Quantity: x{item.quantity}
                      </p>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {formatCurrency(item.price)} each
                        </p>
                        <p className={`font-bold ${redColor}`}>
                          {formatCurrency(item.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(order.subTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping Fee</span>
              <span>{formatCurrency(order.shippingFee)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-[#00BFA5]">
                <span>Discount</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-300 flex justify-between items-center">
              <span className="font-bold">Total</span>
              <span className={`text-xl font-bold ${redColor}`}>
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              className={`flex-1 ${bgRed} text-white px-6 py-3 rounded hover:bg-red-600 transition`}
            >
              Buy Again
            </button>
            <button className="flex-1 border border-gray-300 text-gray-600 px-6 py-3 rounded hover:bg-gray-50 transition">
              Contact Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-inter bg-[#F9FAFB] min-h-screen py-10">
      <div className="container mx-auto px-3.5 lg:px-[135px]">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-[250px] flex-shrink-0">
            <div className="flex items-center gap-3 mb-8 px-2">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
                <UserIcon className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <h3
                  className="font-bold text-black truncate w-32"
                  title={user?.fullName}
                >
                  {user?.fullName}
                </h3>
                <button className="text-gray-500 text-sm flex items-center gap-1 hover:text-[#DB4444]">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {menuItems.map((item) => (
                <div key={item.name}>
                  <div
                    className={`flex items-center gap-2 font-medium cursor-pointer mb-2 ${activeMenu === item.name ? redColor : "text-black hover:text-[#DB4444]"}`}
                    onClick={() => setActiveMenu(item.name)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.subItems.length > 0 && (
                    <div className="ml-7 flex flex-col gap-2">
                      {item.subItems.map((sub) => (
                        <span
                          key={sub}
                          className="text-sm text-gray-500 cursor-pointer hover:text-[#DB4444] transition-colors"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded shadow-sm border border-gray-200 min-h-[600px]">
              <div className="flex overflow-x-auto border-b border-gray-200">
                {orderTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${activeTab === tab ? redColor : "text-black hover:text-[#DB4444]"}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div
                        className={`absolute bottom-0 left-0 w-full h-[2px] ${bgRed}`}
                      ></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-[#FAFAFA]">
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <SearchIcon className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by Order ID or Product Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#EAEAEA] border border-transparent focus:bg-white focus:border-gray-300 rounded px-10 py-2.5 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="p-4 space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-[#DB4444] rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500">Loading orders...</p>
                  </div>
                ) : !Array.isArray(filteredOrders) ||
                  filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <BoxIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No orders found</p>
                    {searchQuery && (
                      <p className="text-sm text-gray-400 mt-2">
                        Try adjusting your search
                      </p>
                    )}
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className="bg-white border border-gray-200 rounded hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-black">
                            Order #{order.orderId.slice(0, 8)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(order.createdDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.orderItemId} className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-100 border border-gray-200 flex-shrink-0 rounded overflow-hidden">
                              {item.imageUrl ? (
                                <img
                                  src={getFirstImage(item.imageUrl)}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BoxIcon className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-black text-sm line-clamp-1 mb-1">
                                {item.productName}
                              </h4>
                              <p className="text-xs text-gray-500">
                                x{item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-sm font-medium ${redColor}`}
                              >
                                {formatCurrency(item.totalPrice)}
                              </div>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-500 text-center">
                            +{order.items.length - 2} more item(s)
                          </p>
                        )}
                      </div>

                      <div className="p-4 bg-[#FFFEFB] border-t border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-black">
                            Order Total:
                          </span>
                          <span className={`text-lg font-bold ${redColor}`}>
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="border border-[#DB4444] text-[#DB4444] px-6 py-2 rounded text-sm hover:bg-red-50 transition"
                          >
                            View Details
                          </button>
                          <button
                            className={`${bgRed} text-white px-6 py-2 rounded text-sm hover:bg-red-600 transition`}
                          >
                            Buy Again
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && <OrderDetailModal order={selectedOrder} />}
    </div>
  );
};

export default OrderHistoryPage;
