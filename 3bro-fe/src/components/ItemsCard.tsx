"use client";
import Card from "@/components/admin/Card";
import { DollarSign, ShoppingBag, ShoppingCart, Users } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { getAvailableProducts } from "@/app/api/product/ProductApi";
import { getAllUsers } from "@/app/api/user/UserApi";
import useOrders from "@/hook/useOrders";
import { formatCurrency } from "@/utils/currency";
import { paymentService } from "@/services/payment.service";

const ItemCards = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { orders } = useOrders();
  const [totalRevenue, setTotalRevenue] = useState(0);

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

  const fetchRevenue = async () => {
    const res = await paymentService.totalRevenue();
    if (res.isSuccess) {
      setTotalRevenue(res.object);
    } else {
      setTotalRevenue(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchProducts(), fetchRevenue()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Tính toán các metrics

  const totalOrders = orders.length;
  const totalClients = users.length;
  const totalProducts = products.length;

  // Animation variants với type chính xác
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Data cho các cards
  const cardsData = [
    {
      name: "Total Revenue",
      icon: DollarSign,
      value: formatCurrency(totalRevenue),
      bgGradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      // trend: "+12.5%",
      // trendUp: true,
    },
    {
      name: "Total Orders",
      icon: ShoppingCart,
      value: totalOrders.toLocaleString(),
      bgGradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      // trend: "+8.2%",
      // trendUp: true,
    },
    {
      name: "Total Clients",
      icon: Users,
      value: totalClients.toLocaleString(),
      bgGradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      // trend: "+5.7%",
      // trendUp: true,
    },
    {
      name: "Total Products",
      icon: ShoppingBag,
      value: totalProducts.toLocaleString(),
      bgGradient: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      // trend: "+3.1%",
      // trendUp: false,
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {cardsData.map((card, index) => (
            <motion.div
              key={card.name}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden transition-all duration-300 hover:shadow-lg">
                {/* Background Gradient Overlay */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.bgGradient} opacity-5 rounded-full -mr-16 -mt-16 transition-transform duration-300 group-hover:scale-110`}
                />

                {/* Icon */}
                <div
                  className={`${card.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
                >
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>

                {/* Content */}
                <div className="relative">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {card.name}
                  </p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {card.value}
                    </h3>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.bgGradient} transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ItemCards;
