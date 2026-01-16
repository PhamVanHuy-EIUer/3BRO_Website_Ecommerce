import { Avatar } from "antd";
import { Bell } from "lucide-react";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="bg-[#eaeaea] shadow-lg border-b border-[#ffffff] mx-4 sm:mx-6 lg:mx-8 mt-4 mb-2 rounded-lg">
      <div className="max-w-2xl mx-auto py-4 px-4 sm:px-6 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-black">
          Dashoard
        </h1>

        <div className="flex items-center space-x-3 sm:space-x-6 ">
          <Image
            src="/Admin/flagVN.png"
            alt="VN"
            width={25}
            height={18}
            className=" shadow-md cursor-pointer"
          />
          <div className="relative">
            <Bell className="w-5 sm:w-6 h-5 text-black cursor-pointer hover:text-blue-500" />
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>
              A
            </Avatar>
            <span className="pl-2 hidden sm:block font-medium text-black">
              Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
