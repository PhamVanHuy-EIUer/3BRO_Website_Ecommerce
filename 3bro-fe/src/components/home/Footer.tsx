"use client";
import Link from "next/link";
import React, { useState } from "react";
import { TbSend2 } from "react-icons/tb";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Account, quickMenu, support } from "@/data/data";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white z-20">
      {/* Main Footer Content */}
      <div className="w-[85vw] mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="space-y-5">
            <Link
              href="/"
              className="uppercase text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hover:from-gray-400 hover:to-white transition-all duration-300"
            >
              3bro
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted online shopping destination for quality products and
              exceptional service.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h3 className="font-semibold text-lg mb-3">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">
                Get 10% off your first order
              </p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black p-2 rounded-md hover:bg-gray-200 transition-all duration-300 hover:scale-110"
                >
                  <TbSend2 className="text-lg" />
                </button>
              </form>
              {subscribed && (
                <p className="text-green-400 text-sm mt-2 animate-fade-in">
                  ✓ Subscribed successfully!
                </p>
              )}
            </div>
          </div>

          {/* Support Section */}
          <div className="space-y-5">
            <h2 className="font-bold text-xl mb-6 relative inline-block">
              Support
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-white to-transparent"></span>
            </h2>
            <div className="space-y-3">
              {support.map((item) => (
                <p
                  key={item.id}
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-300 cursor-pointer flex items-start"
                >
                  <span className="mr-2">•</span>
                  {item.name}
                </p>
              ))}
            </div>
          </div>

          {/* Account Section */}
          <div className="space-y-5">
            <h2 className="font-bold text-xl mb-6 relative inline-block">
              Account
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-white to-transparent"></span>
            </h2>
            <div className="space-y-3">
              {Account.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block text-gray-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-300 group"
                >
                  <span className="relative">
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-5">
            <h2 className="font-bold text-xl mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-white to-transparent"></span>
            </h2>
            <div className="space-y-3">
              {quickMenu.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block text-gray-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-300 group"
                >
                  <span className="relative">
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="w-[85vw] mx-auto py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} 3bro. All rights reserved.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm mr-2">Follow us:</span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-sm" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter className="text-sm" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="text-sm" />
              </a>
            </div>

            {/* Payment Methods (Optional) */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">We accept:</span>
              <div className="flex gap-1">
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-blue-600">
                  VISA
                </div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-orange-600">
                  MC
                </div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-blue-700">
                  PP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
