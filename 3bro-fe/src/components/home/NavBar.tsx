"use client";
import Link from "next/link";
import { IoMdSearch } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { BsCart3 } from "react-icons/bs";
import { quickMenu } from "@/data/data";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "antd";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchProduct } from "@/hook/useSearchProduct";
import { motion } from "framer-motion";

const NavBar = () => {
  const userRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const { authorized, logout } = useAuth();
  const pathname = usePathname();
  const { products } = useSearchProduct(search, 3);

  const getFirstImage = (imageUrl?: string) => {
    if (!imageUrl) return "/blank.jpg";

    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://localhost:7041${imageUrl}`;
  };

  const toggleMenu = () => {
    setShow(!show);
  };

  useEffect(() => {
    const handleClickOutsode = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsode);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsode);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!search.trim()) return;
    setSearch("");

    router.push(`/product/search?keyword=${encodeURIComponent(search.trim())}`);
  };

  useEffect(() => {
    setSearch("");
  }, [pathname]);

  return (
    <div className="border-b-gray-300 border-b py-4">
      <div className="flex justify-between items-center content-center text-black w-[80vw] mx-auto my-2.5">
        {/* Logo */}
        <Link href="/" className="uppercase text-xl md:text-2xl font-bold">
          3bro
        </Link>
        {/* Menu */}
        <div className="text-sm md:text-xl ">
          {quickMenu.map((item) => {
            if (!authorized && item.name === "Account") return null;
            if (authorized && item.name === "Sign In") return null;
            return (
              <Link
                href={item.href}
                key={item.id}
                className="px-6 py-4 font-serif text-md"
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center items-center text-center gap-5">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onClick={handleSearch}
              placeholder="Search product"
              className="px-4 py-2 bg-gray-100"
            />
            <IoMdSearch className="absolute right-3 text-xl" />
            {products.length > 0 && (
              <div className="absolute top-12 bg-gray-100 pb-2 shadow-lg z-20 w-70">
                <ul className="list-none m-0 z-10 ">
                  {products.map((product) => (
                    <motion.li
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="flex items-center gap-3 py-2 px-2 cursor-pointer justify-start hover:bg-gray-200 hover:text-gray-700"
                      onClick={() => {
                        setSearch("");
                        router.push(`/product/${product.id}`);
                      }}
                    >
                      {/* Image */}
                      <img
                        src={getFirstImage(product.imageUrl)}
                        alt={product.productName}
                        className="w-12 h-12 object-cover rounded"
                      />

                      {/* Info */}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-left">
                          {product.productName}
                        </span>
                        <span className="text-xs text-red-500 text-left">
                          {product.price.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <div
                  className="py-1 px-2 cursor-pointer hover:bg-gray-100 underline hover:text-red-500 hover:underline-offset-2"
                  onClick={() => {
                    if (!search.trim()) return;
                    setSearch("");
                    router.push(
                      `/product/search?keyword=${encodeURIComponent(search.trim())}`,
                    );
                  }}
                >
                  View all
                </div>
              </div>
            )}
          </form>
          {authorized === true && (
            <>
              {/* Favorite products */}
              <Link href="/">
                <CiHeart className="text-xl" />
              </Link>
              {/* Cart */}
              <div
                className="cursor-pointer"
                onClick={() => router.push("/user/cart")}
              >
                <BsCart3 className="text-xl" />
              </div>
              <div className="relative" ref={userRef}>
                <Avatar
                  style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                  className="cursor-pointer "
                  onClick={toggleMenu}
                >
                  U
                </Avatar>
                {show && (
                  <div className="absolute top-15  bg-gray-100 p-2 shadow-lg z-10">
                    <ul className="list-none  m-0">
                      <li className="py-2 px-4">
                        <Link href="user/account">Account</Link>
                      </li>
                      <li
                        className="py-2 px-4 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Log out
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
