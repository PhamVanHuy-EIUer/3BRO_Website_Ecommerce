"use client";

import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  DollarSign,
  House,
  Info,
  Mail,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { DiscountIcon } from "@/data/icon";

const ICONS = {
  House,
  DollarSign,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Mail,
  Users,
  Bell,
  Info,
};
const menuItems = [
  { id: 1, name: "Dashboard", icon: House, href: "/admin" },
  { id: 2, name: "Products", icon: ShoppingBag, href: "/admin/products" },
  { id: 3, name: "Users", icon: ShoppingCart, href: "/admin/users" },
  { id: 4, name: "Sales", icon: Users, href: "/admin/sales" },
  { id: 5, name: "Orders", icon: Settings, href: "/admin/orders" },
  { id: 6, name: "Discount", icon: DiscountIcon, href: "/admin/discounts" },
  { id: 9, name: "Settings", icon: Info, href: "/admin/settings" },
  { id: 7, name: "Messages", icon: Mail, href: "admin/messages" },
  { id: 8, name: "Notifications", icon: Bell, href: "/admin/notifications" },
];
const SideBar = () => {
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
      className={`h-full bg-[#f5f5f5] relative z-10 transition-all duration-300 ease-in-out flexshrink-0 ${
        isOpen ? "w-64" : "w-24"
      }`}
    >
      <div className="  backdrop-blur-md p-4 flex flex-col border-r border-[#efefef]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-[#aeaeae] transition-colors max-w-fit cursor-pointer"
        >
          <Menu size={24} />
        </button>

        <nav className="mt-8 grow">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link href={item.href} key={item.id}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${
                    active
                      ? "bg-[#aeaeae] text-black"
                      : "text-gray-700 hover:bg-gray-200"
                  }
                `}
                >
                  <Icon size={20} />
                  {isOpen && (
                    <span className="ml-4 whitespace-nowrap">{item.name}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-5 px-5">
        <Avatar size="large" icon={<UserOutlined />} />
        {isOpen && (
          <div className="flex flex-col">
            <span className="font-medium">Test</span>
            <span className="text-xs text-gray-700">Administrator</span>
          </div>
        )}
      </div>
      {/* <button className="w-full px-5 py-3 flex items-center gap-2 my-1 rounded-xl hover:bg-gray-300">
        <MdLogout /> Logout
      </button> */}
    </div>
  );
};

export default SideBar;
