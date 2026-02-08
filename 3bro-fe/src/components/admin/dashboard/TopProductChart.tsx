"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Product } from "@/models/Product";
import { ApiResponse } from "@/models/ApiResponse";
import { productService } from "@/services/product.service";
import { paymentService } from "@/services/payment.service";

interface TopProductProps {
  productName: string;
  totalRevenue: number;
}

interface ModalTopProducts {
  productId: string;
  productName: string;
  totalRevenue: number;
}

const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

// Hàm rút ngắn tên sản phẩm
const truncateText = (text: string, maxLength: number = 15) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Màu gradient cho các cột
const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#c026d3"];

const TopProductChart = () => {
  const [products, setProducts] = useState<ModalTopProducts[]>([]);

  const fetchTopProductRevenue = async () => {
    try {
      const response: ApiResponse<ModalTopProducts> =
        await paymentService.topProductRevenue(5);
      if (!response.isSuccess) {
        console.log(response);
        return;
      }
      setProducts(response.list || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTopProductRevenue();
  }, []); // Thêm dependency array rỗng để chỉ chạy 1 lần

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-1">
            {payload[0].payload.productName}
          </p>
          <p className="text-sm text-blue-600 font-medium">
            {formatVND(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label cho trục X
  const CustomXAxisTick = ({ x, y, payload }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#666"
          fontSize={11}
          className="select-none"
        >
          {truncateText(payload.value, 12)}
        </text>
      </g>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[420px] bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Top Selling Products
          </h2>
          <p className="text-sm text-gray-500 mt-1">Based on total revenue</p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={products}
          margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="productName"
            tick={<CustomXAxisTick />}
            interval={0}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatVND}
            tick={{ fontSize: 11, fill: "#666" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
          <Bar dataKey="totalRevenue" radius={[8, 8, 0, 0]} maxBarSize={60}>
            {products?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TopProductChart;
