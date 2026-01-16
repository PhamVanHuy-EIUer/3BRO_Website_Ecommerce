import Link from "next/link";
import React from "react";
import { TbSend2 } from "react-icons/tb";
import { Account, quickMenu, support } from "@/data/data";

const Footer = () => {
  return (
    <div className=" bg-black flex  items-center text-white py-7">
      <div className="flex text-left w-[80vw] mx-auto my-2  gap-5 flex-col sm:flex-row sm:justify-between sm:content-center sm:items-center">
        {/* Information */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="uppercase text-2xl font-bold">
            3bro
          </Link>
          <p className="font-semibold">Subscribe</p>
          <p className="font-light text-sm">Get 10% off your first order</p>
          <div className="relative grid">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="border rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
            <TbSend2 className="absolute text-xl top-2.5 right-3" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-bold">Support</h2>
          {/* Address */}
          {support.map((item) => (
            <div className="flex flex-col gap-2" key={item.id}>
              <p className="font-light">{item.name}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-bold">Account</h2>
          {Account.map((item) => (
            <div className="flex flex-col gap-2" key={item.id}>
              <Link href={item.href} className="font-light cursor-pointer">
                {item.name}
              </Link>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {/* Quick links */}
          <h2 className="font-bold">Quick Links</h2>
          {quickMenu.map((item) => (
            <div className="flex flex-col gap-2" key={item.id}>
              <Link href={item.href} className="font-light cursor-pointer">
                {item.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
