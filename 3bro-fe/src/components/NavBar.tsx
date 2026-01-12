"use client";
import Link from "next/link";
import { IoMdSearch } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { BsCart3 } from "react-icons/bs";
import { quickMenu } from "@/data/data";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathName = usePathname();
  return (
    <div className="border-b-gray-300 border-b py-4">
      <div className="flex justify-between items-center content-center text-black w-[80vw] mx-auto my-2.5">
        {/* Logo */}
        <Link href="/" className="uppercase text-xl md:text-2xl font-bold">
          3bro
        </Link>
        {/* Menu */}
        <div className="text-sm md:text-xl ">
          {quickMenu.map((item) => (
            <Link
              href={item.href}
              key={item.id}
              className="px-6 py-4 font-serif text-md"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex justify-center items-center text-center gap-5">
          {/* Search */}
          <div className="relative flex justify-center items-center">
            <input
              type="text"
              placeholder="Search product"
              className="text-sm md:text-sm md:px-4 md:py-2  xl:w-[300] bg-gray-100 object-contain"
            />
            <IoMdSearch className="absolute text-xl top-2.5 right-3 hidden md:flex" />
          </div>
          {pathName !== "/login" && (
            <>
              {/* Favorite products */}
              <Link href="/">
                <CiHeart className="text-xl" />
              </Link>
              {/* Cart */}
              <Link href="/cart">
                <BsCart3 className="text-xl" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
