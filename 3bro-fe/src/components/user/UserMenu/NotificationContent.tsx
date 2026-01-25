"use client";
import React from "react";
import { BoxIcon, TicketIcon } from "lucide-react";

const NotificationsContent: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <BoxIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Order Shipped</h3>
              <p className="text-gray-600 text-sm">
                Your order has been shipped and on the way
              </p>
              <p className="text-gray-400 text-xs mt-1">2 hours ago</p>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200 pb-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <TicketIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">New Voucher Available</h3>
              <p className="text-gray-600 text-sm">
                You have a new 20% discount voucher
              </p>
              <p className="text-gray-400 text-xs mt-1">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsContent;
