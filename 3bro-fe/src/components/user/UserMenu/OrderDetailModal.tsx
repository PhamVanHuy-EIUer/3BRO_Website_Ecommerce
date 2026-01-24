"use client";
import React from "react";
import { ChevronLeftIcon, XIcon, BoxIcon } from "lucide-react";
import type { ViewOrderUser } from "@/models/ViewOrderUser";
import { formatCurrency } from "@/utils/currency";
import { COLORS } from "@/data/data";

interface OrderDetailModalProps {
  order: ViewOrderUser;
  onClose: () => void;
  getFirstImage: (imageUrl: string | null | undefined) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  formatDate: (dateString: string) => string;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  getFirstImage,
  getStatusBadge,
  formatDate,
}) => {
  const { redColor, bgRed } = COLORS;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">Order Details</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
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
};

export default OrderDetailModal;
