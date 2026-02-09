"use client";

import { ApiResponse } from "@/models/ApiResponse";
import { Category } from "@/models/Category";
import { categoryService } from "@/services/category.service";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ProductsInCategory } from "@/models/ProductsInCategory";

// Bảng màu gradient đẹp hơn
const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#6366f1",
  "#14b8a6",
];

// Type cho chart data
type CategoryChartData = {
  name: string;
  value: number;
  percentage?: number;
};

const CategoryChart = () => {
  const [chartData, setChartData] = useState<CategoryChartData[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  function capitalizeFirstLetter(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: ApiResponse<ProductsInCategory> =
          await categoryService.getNumberPorducts();
        console.log(res);
        if (res.code === "200" && res.list) {
          // Tính tổng số products
          const total = res.list.reduce((sum, c) => sum + c.totalProducts, 0);
          setTotalProducts(total);

          // Map sang chartData với percentage
          const mappedData = res.list.map((c) => ({
            name: capitalizeFirstLetter(c.categoryName),
            value: c.totalProducts,
            percentage: (c.totalProducts / total) * 100,
          }));

          setChartData(mappedData);
        }
      } catch (error) {
        console.log("Fetch categories error:", error);
      }
    };

    fetchCategories();
  }, []);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-800 mb-1">{data.name}</p>
          <p className="text-sm text-gray-600">
            Products:{" "}
            <span className="font-medium text-gray-900">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentage:{" "}
            <span className="font-medium text-blue-600">
              {data.payload.percentage?.toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600 font-medium">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Category Distribution
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Total: {totalProducts} products
          </p>
        </div>
        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
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
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              label={({ name, percent }) =>
                `${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={CustomTooltip} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryChart;
