"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Product } from "@/models/Product";

const data = [
  { name: "iPhone 15", revenue: 120000000 },
  { name: "Samsung S24", revenue: 98000000 },
  { name: "MacBook Air", revenue: 85000000 },
  { name: "AirPods Pro", revenue: 62000000 },
  { name: "iPad Pro", revenue: 50000000 },
];

interface modalTopProducts {
  name: string;
  revenue: number;
}

const formatVND = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const TopProductChart = () => {
  const [products, setProducts] = useState<Product[]>();
  useEffect(() => {});
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[380px] bg-[#f5f5f5] p-5 rounded-xl flex-1"
    >
      <h2 className="text-lg font-medium mb-4">Top Selling Products</h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 60, bottom: 20 }}
        >
          <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
          <YAxis tickFormatter={formatVND} />
          <Tooltip formatter={(value) => formatVND(value as number)} />
          <Bar
            name="Revenue"
            dataKey="revenue"
            radius={[6, 6, 0, 0]}
            fill="#8884d8"
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TopProductChart;
