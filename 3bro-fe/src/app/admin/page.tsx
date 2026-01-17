"use client";
import Card from "@/components/admin/dashboard/Card";
import { DollarSign, ShoppingBag, ShoppingCart, Users } from "lucide-react";
import { motion } from "framer-motion";
import TopProductChart from "@/components/admin/dashboard/TopProductChart";
import { useEffect, useState } from "react";
import { User } from "@/models/User";
import { getAllUsers } from "../api/user/UserApi";
import { Product } from "@/models/Product";
import { getAllProducts } from "../api/product/ProductApi";
import SalesOverviewChart from "@/components/admin/dashboard/SalesOverviewChart";

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const fetchUsers = async () => {
    const response = await getAllUsers();
    if (response.isSuccess) {
      const data: User[] = response.list;
      setUsers(data);
    }
  };

  const fetchProducts = async () => {
    const response = await getAllProducts();
    if (response.isSuccess) {
      const data: Product[] = response.list;
      setProducts(data);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  return (
    <div className="flex-1 relative z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Card name="Total Users" icon={DollarSign} value="$10.273" />
          <Card name="Total Orders" icon={ShoppingCart} value="10.273" />
          <Card name="Total Clients" icon={Users} value={`${users.length}`} />
          <Card
            name="Total Products"
            icon={ShoppingBag}
            value={`${products.length}`}
          />
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TopProductChart />
          <SalesOverviewChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
