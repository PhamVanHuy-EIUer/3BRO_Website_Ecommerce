"use client";
import React from "react";
import { BoxIcon, SearchIcon } from "lucide-react";
import type { ViewOrderUser } from "@/models/ViewOrderUser";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/currency";
import { COLORS, ORDER_TABS, OrderStatus } from "@/data/data";

interface PurchaseOrderContentProps {
  activeTab: OrderStatus;
  setActiveTab: (tab: OrderStatus) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
  filteredOrders: ViewOrderUser[];
  onSelectOrder: (order: ViewOrderUser) => void;
  getFirstImage: (imageUrl: string | null | undefined) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  formatDate: (dateString: string) => string;
}

const PurchaseOrderContent: React.FC<PurchaseOrderContentProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  loading,
  filteredOrders,
  onSelectOrder,
  getFirstImage,
  getStatusBadge,
  formatDate,
}) => {
  const { redColor, bgRed } = COLORS;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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

                <div className="p-4 bg-[#FFFEFB] border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-black">Order Total:</span>
                    <span className={`text-lg font-bold ${redColor}`}>
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => onSelectOrder(order)}
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
      </motion.div>
    </>
  );
};

export default PurchaseOrderContent;
