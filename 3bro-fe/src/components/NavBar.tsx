"use client";
import Link from "next/link";
import { IoMdSearch } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { BsCart3 } from "react-icons/bs";
import { quickMenu } from "@/data/data";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "antd";
import { AuthService } from "@/services/auth.service";
import { useEffect, useRef, useState } from "react";
import { userService } from "@/services/user.service";
import { ApiResponse } from "@/models/ApiResponse";
import { User } from "@/models/User";

const NavBar = () => {
  const userRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [showIcons, setShowIcons] = useState(false);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();

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
      const res = await AuthService.logout();
      console.log(res);

      if (res.data.code !== "200") return;
      setShowIcons(false);
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    router.push(`/product/search?keyword=${encodeURIComponent(search.trim())}`);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await userService.getMe();
        console.log(response.data);
        const data: ApiResponse<User> = response.data;
        setShowIcons(data.isSuccess); // true nếu login thành công
      } catch (error) {
        setShowIcons(false); // false nếu chưa login
      }
    };

    checkAuth();
  }, [router]);
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
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product"
              className="px-4 py-2 bg-gray-100"
            />
            <IoMdSearch className="absolute right-3 text-xl" />
          </form>
          {showIcons === true && (
            <>
              {/* Favorite products */}
              <Link href="/">
                <CiHeart className="text-xl" />
              </Link>
              {/* Cart */}
              <Link href="/cart">
                <BsCart3 className="text-xl" />
              </Link>
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
                        <Link href="/account">Account</Link>
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
