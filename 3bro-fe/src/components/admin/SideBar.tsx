"use client";

import { usePathname } from "next/navigation";
import {
  Bell,
  DollarSign,
  House,
  LogOut,
  Mail,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { DiscountIcon, OrderIcon } from "@/data/icon";
import { useAuth } from "@/context/AuthContext";
import { log } from "console";

const menuItems = [
  { id: 1, name: "Dashboard", icon: House, href: "/admin" },
  { id: 2, name: "Products", icon: ShoppingBag, href: "/admin/products" },
  { id: 3, name: "Users", icon: Users, href: "/admin/users" },
  { id: 4, name: "Orders", icon: OrderIcon, href: "/admin/orders" },
  { id: 5, name: "Discount", icon: DiscountIcon, href: "/admin/discounts" },
  {
    id: 6,
    name: "Support Requests",
    icon: Mail,
    href: "/admin/supports",
    badge: 3,
  },
  { id: 7, name: "Notifications", icon: Bell, href: "/admin/notifications" },
  { id: 8, name: "Settings", icon: Settings, href: "/admin/settings" },
];

const SideBar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const pathName = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathName === "/admin";
    }
    return pathName === href || pathName.startsWith(href + "/");
  };

  return (
    <div
      className={`h-screen bg-white relative transition-all duration-300 ease-in-out shrink-0 ${
        isOpen ? "w-72" : "w-20"
      } border-r border-gray-200 shadow-sm`}
    >
      <div className="flex flex-col h-full">
        {/* Header with Logo & Toggle */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isOpen && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center shadow-md">
                  <ShoppingBag className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900">
                    3Bro Admin
                  </h2>
                  <p className="text-xs text-gray-500">Management Portal</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                !isOpen ? "mx-auto" : ""
              }`}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link href={item.href} key={item.id}>
                  <div
                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      active
                        ? "bg-gray-50 text-gray-600 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gray-600 rounded-r-full" />
                    )}

                    <div className={`${isOpen ? "ml-2" : "mx-auto"}`}>
                      <Icon size={20} className="shrink-0" />
                    </div>

                    {isOpen && (
                      <span className="flex-1 whitespace-nowrap">
                        {item.name}
                      </span>
                    )}

                    {/* Badge */}
                    {/* {isOpen && item.badge && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )} */}

                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                        {item.name}
                        {item.badge && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-500 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 p-4">
          <div
            className={`flex items-center gap-3 ${!isOpen ? "justify-center" : ""}`}
          >
            <Avatar
              size={isOpen ? 48 : 40}
              icon={<UserOutlined />}
              className="shrink-0 bg-linear-to-br from-blue-500 to-blue-600"
            />
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 truncate">admin@3bro.com</p>
              </div>
            )}
          </div>

          {isOpen && (
            <button
              onClick={() => logout}
              className="w-full mt-3 px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          )}

          {!isOpen && (
            <button
              onClick={() => logout}
              className="group relative w-full mt-3 p-2.5 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                Logout
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
