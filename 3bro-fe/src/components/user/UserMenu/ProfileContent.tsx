"use client";
import React from "react";
import { UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { COLORS } from "@/data/data";

const ProfileContent: React.FC = () => {
  const { user } = useAuth();
  const { bgRed } = COLORS;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <div className="space-y-6">
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
              defaultValue={user?.fullName || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue={user?.email || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444]"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Not provided"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444]">
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <button
          className={`${bgRed} text-white px-6 py-2 rounded hover:bg-red-600 transition`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileContent;
