"use client";

import { usePathname } from "next/navigation";
import { Bell, MessageSquare, Search, Globe, ChevronDown } from "lucide-react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";

const NavBar = () => {
  const pathName = usePathname();
  const [searchValue, setSearchValue] = useState("");

  // Get page title from pathname
  const getPageTitle = () => {
    const segments = pathName.split("/").filter(Boolean);
    if (segments.length === 1) return "Dashboard";

    const page = segments[segments.length - 1];
    return page
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get breadcrumb
  const getBreadcrumb = () => {
    const segments = pathName.split("/").filter(Boolean);
    if (segments.length === 1) return null;

    return segments.slice(1).map((segment, index) => (
      <span key={index} className="flex items-center">
        <span className="text-gray-400 mx-2">/</span>
        <span
          className={
            index === segments.length - 2
              ? "text-gray-900 font-medium"
              : "text-gray-500"
          }
        >
          {segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </span>
      </span>
    ));
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="mx-4 sm:mx-6 lg:mx-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Page Title & Breadcrumb */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center text-sm">
              <span className="text-gray-500">Admin</span>
              {getBreadcrumb()}
            </div>
            <h1 className="text-xl font-bold text-gray-900 mt-0.5 truncate">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors border border-gray-200 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 min-w-[280px]">
              <Search size={18} className="text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="bg-transparent border-none outline-none text-sm flex-1 text-gray-900 placeholder-gray-400"
              />
              {searchValue && (
                <button
                  onClick={() => setSearchValue("")}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  ×
                </button>
              )}
            </div>

            {/* Mobile Search Icon */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Search size={20} className="text-gray-600" />
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-gray-200" />

            {/* Action Icons */}
            <div className="flex items-center gap-1">
              {/* Language/Globe */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                <Globe
                  size={20}
                  className="text-gray-600 group-hover:text-gray-900"
                />
              </button>

              {/* Messages */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                <MessageSquare
                  size={20}
                  className="text-gray-600 group-hover:text-gray-900"
                />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                <Bell
                  size={20}
                  className="text-gray-600 group-hover:text-gray-900"
                />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-gray-200" />

            {/* User Profile */}
            <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors group">
              <Avatar
                size={36}
                icon={<UserOutlined />}
                className="bg-gradient-to-br from-red-500 to-red-600 flex-shrink-0"
              />
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900 leading-tight">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  Administrator
                </p>
              </div>
              <ChevronDown
                size={16}
                className="text-gray-400 group-hover:text-gray-600 hidden lg:block"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
