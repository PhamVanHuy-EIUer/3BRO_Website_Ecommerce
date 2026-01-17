"use client";

import { ApiResponse } from "@/models/ApiResponse";
import { Category } from "@/models/Category";
import { categoryService } from "@/services/category.service";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#FF6B68", "#4D69FF", "#FFD166", "#06D6A0", "#A29BFE"];

// tạo type cho chart
type CategoryChartData = {
  name: string;
  value: number;
};

const CategoryChart = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [chartData, setChartData] = useState<CategoryChartData[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: ApiResponse<Category> =
          await categoryService.getCategories();

        if (res.code === "200" && res.list) {
          setCategories(res.list);

          // map sang chartData
          const mappedData = res.list.map((c, index) => ({
            name: c.categoryName,
            value: 1, // tạm thời 1 cho mỗi category; nếu backend trả productCount thì dùng field đó
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
              innerRadius={60}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryChart;
