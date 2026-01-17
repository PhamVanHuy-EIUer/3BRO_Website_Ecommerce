"use client";

import { usePathname } from "next/navigation";
import {
  MdNotifications,
  MdOutlineChat,
  MdPublic,
  MdSearch,
} from "react-icons/md";
const NavBar = () => {
  const pathName = usePathname();
  console.log(pathName);
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-[#f5f5f5]">
      <div className="uppercase font-extrabold">
        {pathName.split("/")[2] == null ? "Dashboard" : pathName.split("/")[2]}
      </div>
      <div className="flex items-center gap-5">
        <div className="flex flex-row items-center justify-center gap-2.5 bg-[#eaeaea] px-2.5 py-1.5 rounded-xl">
          <MdSearch />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none"
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-5 cursor-pointer">
          <MdNotifications size={20} />
          <MdOutlineChat size={20} />
          <MdPublic size={20} />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
