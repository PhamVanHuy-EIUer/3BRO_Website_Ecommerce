"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BoxIcon,
  BellIcon,
  TicketIcon,
  UserIcon,
  MapPinIcon,
  LockIcon,
  LogOutIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SubItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  subItems: SubItem[];
}

const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      name: "My Account",
      icon: <UserIcon className="w-5 h-5" />,
      path: "/user/account",
      subItems: [
        {
          name: "Profile",
          icon: <UserIcon className="w-4 h-4" />,
          path: "/user/account",
        },
        {
          name: "Address",
          icon: <MapPinIcon className="w-4 h-4" />,
          path: "/user/account/address",
        },
        {
          name: "Change Password",
          icon: <LockIcon className="w-4 h-4" />,
          path: "/user/account/changePassword",
        },
      ],
    },
    {
      name: "Purchase Order",
      icon: <BoxIcon className="w-5 h-5" />,
      path: "/user/purchase",
      subItems: [],
    },
    {
      name: "Notifications",
      icon: <BellIcon className="w-5 h-5" />,
      path: "/user/notification",
      subItems: [
        {
          name: "Order Updates",
          icon: <BoxIcon className="w-4 h-4" />,
          path: "/user/notification/order-updates",
        },
        {
          name: "Promotions",
          icon: <TicketIcon className="w-4 h-4" />,
          path: "/user/notification/promotions",
        },
      ],
    },
    {
      name: "Voucher Wallet",
      icon: <TicketIcon className="w-5 h-5" />,
      path: "/user/voucher",
      subItems: [],
    },
  ];

  // Check if current path matches menu item
  const isActiveMenu = (item: MenuItem) => {
    return pathname.startsWith(item.path);
  };

  // Check if current path matches submenu item
  const isActiveSubmenu = (subItem: SubItem) => {
    return pathname === subItem.path;
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="w-full md:w-62.5 shrink-0">
      {/* User Profile Section */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
          <UserIcon className="w-6 h-6 text-gray-500" />
        </div>
        <div>
          <h3
            className="font-bold text-black truncate w-32"
            title={user?.fullName}
          >
            {user?.fullName}
          </h3>
          <Link
            href="/user/account"
            className="text-gray-500 text-sm flex items-center gap-1 hover:text-[#DB4444] transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-6">
        {menuItems.map((item) => (
          <div key={item.name}>
            {/* Main Menu Item */}
            <Link
              href={item.path}
              className={`flex items-center gap-2 font-medium cursor-pointer mb-2 transition-colors ${
                isActiveMenu(item)
                  ? "text-[#DB4444]"
                  : "text-black hover:text-[#DB4444]"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>

            {/* Submenu Items */}
            {item.subItems.length > 0 && isActiveMenu(item) && (
              <div className="ml-7 flex flex-col gap-2">
                {item.subItems.map((sub) => (
                  <div
                    key={sub.name}
                    onClick={() => router.push(sub.path)}
                    className={`flex items-center gap-2 text-sm cursor-pointer transition-colors ${
                      isActiveSubmenu(sub)
                        ? "text-[#DB4444]"
                        : "text-gray-500 hover:text-[#DB4444]"
                    }`}
                  >
                    {sub.icon}
                    <span>{sub.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 font-medium cursor-pointer text-gray-600 hover:text-red-600 transition-colors w-full"
        >
          <LogOutIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
