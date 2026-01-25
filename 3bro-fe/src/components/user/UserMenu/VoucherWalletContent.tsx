"use client";
import React from "react";
import { TicketIcon } from "lucide-react";

const VoucherWalletContent: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Vouchers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-2 border-dashed border-[#DB4444] rounded p-4 bg-red-50">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg text-[#DB4444]">20% OFF</h3>
              <p className="text-gray-600 text-sm">Minimum purchase ₫500,000</p>
            </div>
            <TicketIcon className="w-8 h-8 text-[#DB4444]" />
          </div>
          <p className="text-xs text-gray-500">Valid until: 31/01/2026</p>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded p-4 bg-gray-50 opacity-50">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-600">Free Shipping</h3>
              <p className="text-gray-600 text-sm">No minimum purchase</p>
            </div>
            <TicketIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">Expired</p>
        </div>
      </div>
    </div>
  );
};

export default VoucherWalletContent;
