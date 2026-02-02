"use client";
import React, { useState, useEffect } from "react";
import { UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { COLORS } from "@/data/data";

import { notification } from "antd";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}
const ProfileContent: React.FC = () => {
  const { user, refreshAuth } = useAuth();
  const { bgRed } = COLORS;
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {contextHolder}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">My Profile</h2>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-gray-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {user?.fullName || "User Name"}
                </h3>
                <p className="text-gray-500">
                  {user?.email || "email@example.com"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none  bg-gray-100"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none bg-gray-100"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none bg-gray-100"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  placeholder="Enter address"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none  bg-gray-100"
                  readOnly
                />
              </div>
            </div>

            <button
              type="submit"
              className={`${bgRed} text-white px-6 py-2 rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => router.push("profile/address")}
            >
              Edit Profile
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default ProfileContent;
