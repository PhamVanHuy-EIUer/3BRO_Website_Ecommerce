"use client";
import React from "react";
import {
  BoxIcon,
  BellIcon,
  TicketIcon,
  UserIcon,
  MapPinIcon,
  LockIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  subItems: { name: string; icon: React.ReactNode }[];
}

interface SidebarProps {
  activeMenu: string;
  activeSubmenu: string | null;
  onMenuClick: (menuName: string) => void;
  onSubmenuClick: (submenuName: string) => void;
  redColor: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  activeSubmenu,
  onMenuClick,
  onSubmenuClick,
  redColor,
}) => {
  const { user } = useAuth();

  const menuItems: MenuItem[] = [
    {
      name: "My Account",
      icon: <UserIcon className="w-5 h-5" />,
      subItems: [
        { name: "Profile", icon: <UserIcon className="w-4 h-4" /> },
        { name: "Address", icon: <MapPinIcon className="w-4 h-4" /> },
        { name: "Change Password", icon: <LockIcon className="w-4 h-4" /> },
      ],
    },
    {
      name: "Purchase Order",
      icon: <BoxIcon className="w-5 h-5" />,
      subItems: [],
    },
    {
      name: "Notifications",
      icon: <BellIcon className="w-5 h-5" />,
      subItems: [
        { name: "Order Updates", icon: <BoxIcon className="w-4 h-4" /> },
        { name: "Promotions", icon: <TicketIcon className="w-4 h-4" /> },
      ],
    },
    {
      name: "Voucher Wallet",
      icon: <TicketIcon className="w-5 h-5" />,
      subItems: [],
    },
  ];

  return (
    <div className="w-full md:w-[250px] flex-shrink-0">
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
          <button
            className="text-gray-500 text-sm flex items-center gap-1 hover:text-[#DB4444]"
            onClick={() => {
              onMenuClick("My Account");
              onSubmenuClick("Profile");
            }}
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
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {menuItems.map((item) => (
          <div key={item.name}>
            <div
              className={`flex items-center gap-2 font-medium cursor-pointer mb-2 ${
                activeMenu === item.name && !activeSubmenu
                  ? redColor
                  : "text-black hover:text-[#DB4444]"
              }`}
              onClick={() => onMenuClick(item.name)}
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
            {item.subItems.length > 0 && (
              <div className="ml-7 flex flex-col gap-2">
                {item.subItems.map((sub) => (
                  <div
                    key={sub.name}
                    className={`flex items-center gap-2 text-sm cursor-pointer transition-colors ${
                      activeSubmenu === sub.name
                        ? redColor
                        : "text-gray-500 hover:text-[#DB4444]"
                    }`}
                    onClick={() => onSubmenuClick(sub.name)}
                  >
                    {sub.icon}
                    <span>{sub.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
