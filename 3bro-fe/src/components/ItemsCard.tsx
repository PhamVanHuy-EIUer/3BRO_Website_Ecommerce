"use client";
import Card from "@/components/admin/Card";
import { DollarSign, ShoppingBag, ShoppingCart, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { getAvailableProducts } from "@/app/api/product/ProductApi";
import { getAllUsers } from "@/app/api/user/UserApi";
import useOrders from "@/hook/useOrders";
import { formatVND } from "@/utils/currency";

const ItemCards = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { orders } = useOrders();

  const fetchUsers = async () => {
    const response = await getAllUsers();
    if (response.isSuccess) {
      const data: User[] = response.list;
      setUsers(data);
    }
  };

  const fetchProducts = async () => {
    const response = await getAvailableProducts();
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
          <Card
            name="Total Revenue"
            icon={DollarSign}
            value={formatVND(
              orders.reduce((total, order) => total + order.totalPrice, 0),
            )}
          />
          <Card
            name="Total Orders"
            icon={ShoppingCart}
            value={`${orders.length}`}
          />
          <Card name="Total Clients" icon={Users} value={`${users.length}`} />
          <Card
            name="Total Products"
            icon={ShoppingBag}
            value={`${products.length}`}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ItemCards;
