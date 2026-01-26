"use client";
import React, { useState, useEffect } from "react";
import { UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { COLORS } from "@/data/data";
import { userService } from "@/services/user.service";
import { UpdateProfile } from "@/models/UpdateProfile";
import { notification } from "antd";
import { ApiResponse } from "@/models/ApiResponse";
import { motion } from "framer-motion";

const ProfileContent: React.FC = () => {
  const { user, refreshAuth } = useAuth();
  const { bgRed } = COLORS;
  const [api, contextHolder] = notification.useNotification();

  const [formData, setFormData] = useState<UpdateProfile>({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [loading, setLoading] = useState(false);
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

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // setMessage(null);
    if (
      formData.fullName === user?.fullName &&
      formData.email === user?.email &&
      formData.phone === user?.phone &&
      formData.address === user?.address
    ) {
      api.error({
        title: "No change detected",
        placement: "topRight",
        duration: 2,
      });
      setLoading(false);
      return;
    }

    try {
      const response: ApiResponse<any> =
        await userService.updateProfile(formData);
      if (!response.isSuccess) {
        api.error({
          title: response.message,
          placement: "topRight",
          duration: 2,
        });
        console.log(response);
        return;
      }
      // Cập nhật lại user context sau khi update thành công
      await refreshAuth();

      api.success({
        title: "Update profile successfully",
        placement: "topRight",
        duration: 2,
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      api.error({
        title: "Error updating profile",
        placement: "topRight",
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
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

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444]"
                  required
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
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444] bg-gray-100"
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
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444]"
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
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${bgRed} text-white px-6 py-2 rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default ProfileContent;
