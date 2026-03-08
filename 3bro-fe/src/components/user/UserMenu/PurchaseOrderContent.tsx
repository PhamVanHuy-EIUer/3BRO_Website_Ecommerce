"use client";
import React, { useState } from "react";
import { BoxIcon, SearchIcon } from "lucide-react";
import type { ViewOrderUser } from "@/models/ViewOrderUser";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/currency";
import { COLORS, ORDER_TABS, OrderStatus } from "@/data/data";
import Image from "next/image";
import { paymentService } from "@/services/payment.service";
import { orderService } from "@/services/order.service";
import { notification, Modal } from "antd";
import { ApiResponse } from "@/models/ApiResponse";

interface PurchaseOrderContentProps {
  activeTab: OrderStatus;
  setActiveTab: (tab: OrderStatus) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
  filteredOrders: ViewOrderUser[];
  onSelectOrder: (order: ViewOrderUser) => void;
  onCancelSuccess: () => void;
  getFirstImage: (imageUrl: string | null | undefined) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  formatDate: (dateString: string) => string;
}

const PAYMENT_STATUS = {
  UNPAID: 0,
  PAID: 1,
  DELETED: 2,
} as const;

const getPaymentStatusBadge = (status: number) => {
  switch (status) {
    case PAYMENT_STATUS.PAID:
      return (
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
          PAID
        </span>
      );
    case PAYMENT_STATUS.UNPAID:
      return (
        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
          UNPAID
        </span>
      );
    case PAYMENT_STATUS.DELETED:
      return (
        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
          DELETE
        </span>
      );
    default:
      return null;
  }
};

const PurchaseOrderContent: React.FC<PurchaseOrderContentProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  loading,
  filteredOrders,
  onSelectOrder,
  onCancelSuccess,
  getFirstImage,
  getStatusBadge,
  formatDate,
}) => {
  const { redColor, bgRed } = COLORS;
  const [api, contextHolder] = notification.useNotification();
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null,
  );

  const handlePayOrder = async (orderId: string) => {
    try {
      setPayingOrderId(orderId);
      const response = await paymentService.paymentByMomo(orderId);
      if (response.payUrl) {
        window.location.href = response.payUrl;
      } else {
        api.error({
          message: "Payment failed",
          description: "Unable to create MoMo payment",
          placement: "topRight",
          duration: 3,
        });
      }
    } catch (error: any) {
      console.error("Error creating MoMo payment:", error);
      api.error({
        message: "Payment failed",
        description: "Unable to create MoMo payment",
        placement: "topRight",
        duration: 3,
      });
    } finally {
      setPayingOrderId(null);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    Modal.confirm({
      title: "Cancel Order",
      content:
        "Are you sure you want to cancel this order? This action cannot be undone.",
      okText: "Yes, Cancel Order",
      cancelText: "No, Keep It",
      okButtonProps: {
        danger: true,
        style: { background: "#DB4444", borderColor: "#DB4444" },
      },
      centered: true,
      onOk: async () => {
        try {
          setCancellingOrderId(orderId);
          const res: ApiResponse<any> = await orderService.cancelOrder(orderId);

          if (res?.isSuccess === false) {
            api.error({
              message: "Cancellation failed",
              description: res.message || "Unable to cancel this order.",
              placement: "topRight",
              duration: 3,
            });
            return;
          }

          api.success({
            message: "Order Cancelled",
            description: "Your order has been cancelled successfully.",
            placement: "topRight",
            duration: 3,
          });

          onCancelSuccess();
        } catch (error: any) {
          console.error("Error cancelling order:", error);
          api.error({
            message: "Cancellation failed",
            description: "An error occurred while cancelling the order.",
            placement: "topRight",
            duration: 3,
          });
        } finally {
          setCancellingOrderId(null);
        }
      },
    });
  };

  return (
    <>
      {contextHolder}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200">
          {ORDER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab ? redColor : "text-black hover:text-[#DB4444]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div
                  className={`absolute bottom-0 left-0 w-full h-0.5 ${bgRed}`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Search */}
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

        {/* Orders List */}
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-[#DB4444] rounded-full animate-spin" />
              <p className="mt-4 text-gray-500">Loading orders...</p>
            </div>
          ) : !Array.isArray(filteredOrders) || filteredOrders.length === 0 ? (
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
            filteredOrders.map((order) => {
              const isPending = order.status.toLowerCase() === "pending";
              const isCancelling = cancellingOrderId === order.orderId;

              return (
                <div
                  key={order.orderId}
                  className="bg-white border border-gray-200 rounded hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
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
                      {getPaymentStatusBadge(order.paymentStatus)}
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-4 space-y-3">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.orderItemId} className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-100 border border-gray-200 shrink-0 rounded overflow-hidden">
                          {item.imageUrl ? (
                            <Image
                              src={getFirstImage(item.imageUrl)}
                              alt={item.productName}
                              width={64}
                              height={64}
                              loading="lazy"
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
                          <div className={`text-sm font-medium ${redColor}`}>
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

                  {/* Footer */}
                  <div className="p-4 bg-[#FFFEFB] border-t border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-black">Order Total:</span>
                      <span className={`text-lg font-bold ${redColor}`}>
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>

                    <div className="flex justify-end gap-3">
                      {/* Cancel button — chỉ hiện khi Pending */}
                      {isPending && (
                        <button
                          onClick={() => handleCancelOrder(order.orderId)}
                          disabled={isCancelling}
                          className="border border-gray-300 text-gray-600 px-6 py-2 rounded text-sm hover:bg-gray-50 hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isCancelling ? "Cancelling..." : "Cancel Order"}
                        </button>
                      )}

                      {/* View Details */}
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="border border-[#DB4444] text-[#DB4444] px-6 py-2 rounded text-sm hover:bg-red-50 transition"
                      >
                        View Details
                      </button>

                      {/* Pay Now — chỉ hiện khi UNPAID + Transfer */}
                      {order.paymentStatus === PAYMENT_STATUS.UNPAID &&
                        order.paymentMethod === "Transfer" && (
                          <button
                            className={`${bgRed} text-white px-6 py-2 rounded text-sm hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                            disabled={payingOrderId === order.orderId}
                            onClick={() => handlePayOrder(order.orderId)}
                          >
                            {payingOrderId === order.orderId
                              ? "Processing..."
                              : "Pay Now"}
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </>
  );
};

export default PurchaseOrderContent;
