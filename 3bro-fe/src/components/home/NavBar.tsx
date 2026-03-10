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
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineUser } from "react-icons/hi";

const NavBar = () => {
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { authorized, loading, logout, user } = useAuth();
  const pathname = usePathname();
  const { products, total } = useSearchProduct(search, 3);

  const getFirstImage = (imageUrl?: string) => {
    if (!imageUrl) return "/blank.jpg";
    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://localhost:7041${imageUrl}`;
  };

  const toggleMenu = () => setShow(!show);

  // Sticky navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShow(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShow(false);
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    const searchTerm = search.trim();
    setSearch("");
    setIsSearchFocused(false);
    router.push(`/product/search?keyword=${encodeURIComponent(searchTerm)}`);
  };

  useEffect(() => {
    setSearch("");
    setIsSearchFocused(false);
  }, [pathname]);

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-1100 bg-white transition-all duration-300 ${
        isScrolled
          ? "shadow-lg border-b border-gray-200"
          : "border-b border-gray-300"
      }`}
    >
      <div className="w-[85vw] mx-auto py-4 ">
        <div className="flex justify-between items-center gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="uppercase text-2xl md:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent hover:from-gray-600 hover:to-gray-800 transition-all duration-300"
          >
            3bro
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {quickMenu.map((item) => {
              if (loading) {
                if (item.name === "Account" || item.name === "Sign In")
                  return null;
              } else {
                if (!authorized && item.name === "Account") return null;
                if (authorized && item.name === "Sign In") return null;
              }

              const isActive = pathname === item.href;

              return (
                <Link
                  href={item.href}
                  key={item.id}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 group ${
                    isActive
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 transform origin-left transition-transform duration-300 ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <form
                onSubmit={handleSearch}
                className="relative flex items-center"
              >
                <motion.input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search products..."
                  animate={{ width: isSearchFocused ? 280 : 200 }}
                  transition={{ duration: 0.3 }}
                  className="pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <IoMdSearch className="text-xl" />
                </button>
              </form>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {total > 0 && search.trim() && isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-14 left-0 right-0 bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-100 z-50"
                  >
                    <div className="max-h-96 overflow-y-auto">
                      {products.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                          onClick={() => {
                            setSearch("");
                            setIsSearchFocused(false);
                            router.push(`/product/${product.id}`);
                          }}
                        >
                          <img
                            src={getFirstImage(product.imageUrl)}
                            alt={product.productName}
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {product.productName}
                            </p>
                            <p className="text-sm font-semibold text-red-500 mt-1">
                              {product.price.toLocaleString("vi-VN")} ₫
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {total > 3 && (
                      <div
                        className="p-3 text-center bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => {
                          const searchTerm = search.trim();
                          setSearch("");
                          setIsSearchFocused(false);
                          router.push(
                            `/product/search?keyword=${encodeURIComponent(searchTerm)}`,
                          );
                        }}
                      >
                        View all {total} results →
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Actions */}
            {!loading && authorized && (
              <div className="flex items-center gap-3">
                {/* Wishlist */}
                {/* <Link
                  href="/user/wishlist"
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300 group"
                  aria-label="Wishlist"
                >
                  <CiHeart className="text-2xl text-gray-700 group-hover:text-red-500 transition-colors" />
                </Link> */}

                {/* Cart */}
                <button
                  onClick={() => router.push("/user/cart")}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300 group"
                  aria-label="Shopping Cart"
                >
                  <BsCart3 className="text-xl text-gray-700 group-hover:text-gray-900 transition-colors" />
                </button>

                {/* User Menu */}
                <div className="relative" ref={userRef}>
                  <button
                    onClick={toggleMenu}
                    className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-full transition-all duration-300"
                  >
                    <Avatar
                      style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                      className="cursor-pointer"
                      size={36}
                    >
                      {user?.fullName?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                  </button>

                  <AnimatePresence>
                    {show && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-14 right-0 bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100 min-w-[180px] z-50"
                      >
                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user?.fullName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email || ""}
                          </p>
                        </div>
                        <ul className="py-1">
                          <li>
                            <Link
                              href="/user/account"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setShow(false)}
                            >
                              <HiOutlineUser className="text-lg" />
                              My Account
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              Log out
                            </button>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Not Logged In */}
            {!loading && !authorized && (
              <Link
                href="/login"
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all duration-300 hover:shadow-lg"
              >
                Sign In
              </Link>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NavBar;
