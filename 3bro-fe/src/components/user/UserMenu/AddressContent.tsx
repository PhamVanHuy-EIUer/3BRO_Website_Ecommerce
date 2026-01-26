"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { COLORS } from "@/data/data";
import { motion } from "framer-motion";

const AddressContent: React.FC = () => {
  const { user } = useAuth();
  const { bgRed } = COLORS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Addresses</h2>
          <button
            className={`${bgRed} text-white px-4 py-2 rounded hover:bg-red-600 transition flex items-center gap-2`}
          >
            <span>+</span> Add New Address
          </button>
        </div>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{user?.fullName || "User Name"}</p>
                <p className="text-gray-600">
                  123 Street Name, District, Ho Chi Minh City
                </p>
                <p className="text-gray-600">Phone: 0123456789</p>
              </div>
              <div className="flex gap-2">
                <button className="text-[#DB4444] text-sm hover:underline">
                  Edit
                </button>
                <button className="text-gray-500 text-sm hover:underline">
                  Delete
                </button>
              </div>
            </div>
            <span className="inline-block bg-[#DB4444] text-white text-xs px-2 py-1 rounded">
              Default
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddressContent;
