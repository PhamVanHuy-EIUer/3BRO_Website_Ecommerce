"use client";
import React, { useState, useEffect } from "react";
import { TicketIcon, Calendar, Tag, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Discount } from "@/models/Discount";
import { ApiResponse } from "@/models/ApiResponse";
import { discountService } from "@/services/discount.service";
import LoadingUser from "@/components/LoadingUser";
import { formatCurrency } from "@/utils/currency";

const VoucherWalletContent: React.FC = () => {
  const [vouchers, setVouchers] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "expired">("active");

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const res: ApiResponse<Discount> = await discountService.getDiscount();
      if (res.code === "200") {
        setVouchers(res.list || []);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const isVoucherExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const activeVouchers = vouchers.filter(
    (v) => v.isActive && !isVoucherExpired(v.endDate),
  );
  const expiredVouchers = vouchers.filter(
    (v) => !v.isActive || isVoucherExpired(v.endDate),
  );

  const displayVouchers =
    activeTab === "active" ? activeVouchers : expiredVouchers;

  if (loading) {
    return <LoadingUser />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">My Vouchers</h2>
        <p className="text-gray-600">
          You have {activeVouchers.length} active voucher
          {activeVouchers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-3 px-4 font-semibold transition-all duration-200 ${
            activeTab === "active"
              ? "text-[#DB4444] border-b-2 border-[#DB4444]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Active ({activeVouchers.length})
        </button>
        <button
          onClick={() => setActiveTab("expired")}
          className={`pb-3 px-4 font-semibold transition-all duration-200 ${
            activeTab === "expired"
              ? "text-[#DB4444] border-b-2 border-[#DB4444]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Expired ({expiredVouchers.length})
        </button>
      </div>

      {/* Vouchers Grid */}
      {displayVouchers.length === 0 ? (
        <div className="text-center py-16">
          <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {activeTab === "active"
              ? "No active vouchers available"
              : "No expired vouchers"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {displayVouchers.map((voucher, index) => {
            const isExpired =
              !voucher.isActive || isVoucherExpired(voucher.endDate);

            return (
              <motion.div
                key={voucher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ${
                  isExpired
                    ? "border-gray-300 bg-gray-50 opacity-60"
                    : "border-[#DB4444] bg-gradient-to-br from-red-50 to-orange-50 hover:shadow-lg hover:scale-[1.02]"
                }`}
              >
                {/* Voucher Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      {/* Discount Badge */}
                      <div className="inline-flex items-center gap-2 mb-3">
                        {voucher.discountPercent > 0 ? (
                          <h3
                            className={`text-3xl font-bold ${
                              isExpired ? "text-gray-500" : "text-[#DB4444]"
                            }`}
                          >
                            {voucher.discountPercent}% OFF
                          </h3>
                        ) : (
                          <h3
                            className={`text-2xl font-bold ${
                              isExpired ? "text-gray-500" : "text-[#DB4444]"
                            }`}
                          >
                            -{formatCurrency(voucher.discountAmount)}
                          </h3>
                        )}
                      </div>

                      {/* Description */}
                      {voucher.description && (
                        <p className="text-gray-700 text-sm mb-2 font-medium">
                          {voucher.description}
                        </p>
                      )}

                      {/* Min Order */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Tag className="w-4 h-4" />
                        <span>
                          Min. purchase:{" "}
                          {formatCurrency(voucher.minOrderAmount)}
                        </span>
                      </div>

                      {/* Max Discount */}
                      {voucher.maxDiscountAmount && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4" />
                          <span>
                            Max discount:{" "}
                            {formatCurrency(voucher.maxDiscountAmount)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Icon */}
                    <TicketIcon
                      className={`w-12 h-12 ${
                        isExpired ? "text-gray-400" : "text-[#DB4444]"
                      }`}
                    />
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {isExpired ? "Expired" : "Valid until"}:{" "}
                        {formatDate(voucher.endDate)}
                      </span>
                    </div>

                    {/* Code Badge */}
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                        isExpired
                          ? "bg-gray-200 text-gray-600"
                          : "bg-[#DB4444] text-white"
                      }`}
                    >
                      {voucher.code}
                    </div>
                  </div>

                  {/* Quantity Badge */}
                  {!isExpired && voucher.quantity > 0 && (
                    <div className="mt-3">
                      <div className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                        {voucher.quantity} left
                      </div>
                    </div>
                  )}

                  {/* Expired Overlay */}
                  {isExpired && (
                    <div className="absolute top-4 right-4 bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold transform rotate-12">
                      EXPIRED
                    </div>
                  )}
                </div>

                {/* Decorative circles */}
                <div
                  className={`absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${
                    isExpired ? "bg-gray-200" : "bg-white"
                  }`}
                ></div>
                <div
                  className={`absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${
                    isExpired ? "bg-gray-200" : "bg-white"
                  }`}
                ></div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default VoucherWalletContent;
