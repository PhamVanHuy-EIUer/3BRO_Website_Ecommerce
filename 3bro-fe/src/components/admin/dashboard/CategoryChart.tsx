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

const COLORS = ["#FF6B68", "#4D69FF", "#FFD166", "#06D6A0", "#A29BFE"];

// tạo type cho chart
type CategoryChartData = {
  name: string;
  value: number;
};

const CategoryChart = () => {
  const [chartData, setChartData] = useState<CategoryChartData[]>([]);

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
          //   setCategories(res.list);

          // map sang chartData và capitalize chữ đầu
          const mappedData = res.list.map((c) => ({
            name: capitalizeFirstLetter(c.categoryName),
            value: c.totalProducts,
          }));

          setChartData(mappedData);
        }
      } catch (error) {
        console.log("Fetch categories error:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="h-[450px] bg-[#f5f5f5] p-5 rounded-xl flex-1"
    >
      <h2 className="text-base md:text-lg font-medium mb-4 text-gray-600">
        Category Distribution
      </h2>

      <div className="w-full h-[350px]">
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
            <Tooltip
              contentStyle={{
                backgroundColor: "#f5f5f5",
                borderBlock: "#4b55663",
                borderRadius: "8px",
                padding: "8px",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#111" }}
            />
            <Legend
              iconType="circle"
              layout="horizontal"
              align="center"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryChart;
