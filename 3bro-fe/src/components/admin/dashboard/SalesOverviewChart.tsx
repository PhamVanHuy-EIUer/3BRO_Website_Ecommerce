"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ApiResponse } from "@/models/ApiResponse";
import { paymentService } from "@/services/payment.service";
import { TrendingUp, DollarSign, Package } from "lucide-react";

interface MonthlyRevenue {
  month: string;
  year: number;
  totalSale: number;
  numOfProduct: number;
}

const SalesOverviewChart = () => {
  const [data, setData] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const res: ApiResponse<MonthlyRevenue> =
          await paymentService.monthlyRevenue();

        if (res.code === "200" && res.isSuccess) {
          setData(res.list || []);
        } else {
          setError(res.message || "Failed to load data");
        }
      } catch (error) {
        console.error("Error fetching monthly revenue:", error);
        setError("Unable to fetch revenue data");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyRevenue();
  }, []);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">
            {payload[0].payload.month} {payload[0].payload.year}
          </p>
          <div className="space-y-1">
            <p className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span className="text-gray-600">Revenue:</span>
              <span className="font-semibold text-purple-600">
                {payload[0].value.toLocaleString()} VND
              </span>
            </p>
            <p className="text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">Products:</span>
              <span className="font-semibold text-blue-600">
                {payload[0].payload.numOfProduct}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-80 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-xl p-8 border border-red-200"
      >
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Unable to Load Data
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Sales Overview</h2>
            <p className="text-sm text-gray-500">Monthly revenue trends</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 bg-gray-50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 5, left: 10 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9c27b0" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#9c27b0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#d1d5db" }}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#d1d5db" }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k VND`}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="totalSale"
              stroke="#9c27b0"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#ffffff",
                stroke: "#9c27b0",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                strokeWidth: 2,
                fill: "#9c27b0",
              }}
              fill="url(#colorRevenue)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Note */}
      {data.length > 0 && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          Showing data for {data.length} months • Last updated:{" "}
          {new Date().toLocaleDateString()}
        </p>
      )}
    </motion.div>
  );
};

export default SalesOverviewChart;
