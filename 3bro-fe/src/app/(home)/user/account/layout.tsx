"use client";

import React from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/user/UserMenu/SideBar";
import { AuthProvider } from "@/context/AuthContext";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="font-inter bg-[#F9FAFB] min-h-screen py-10">
        <div className="container mx-auto px-3.5 lg:px-33.75">
          <div className="flex flex-col md:flex-row gap-6">
            {/* LEFT SIDEBAR*/}
            <Sidebar />

            {/* RIGHT CONTENT */}
            <div className="flex-1">
              <motion.div
                key={
                  typeof window !== "undefined"
                    ? window.location.pathname
                    : "/user/account"
                }
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded shadow-sm border border-gray-200 min-h-150"
              >
                {children}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
