"use client";
import { COLORS } from "@/data/data";
import React from "react";

const ChangePasswordContent: React.FC = () => {
  const { bgRed } = COLORS;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>
      <div className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444]"
          />
        </div>
        <button
          className={`${bgRed} text-white px-6 py-2 rounded hover:bg-red-600 transition`}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordContent;
