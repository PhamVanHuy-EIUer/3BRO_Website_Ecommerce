"use client";
import { useAuth } from "@/context/AuthContext";
import { COLORS } from "@/data/data";
import { ApiResponse } from "@/models/ApiResponse";
import { ResetPassword } from "@/models/ResetPassword";
import { userService } from "@/services/user.service";
import { notification } from "antd";
import React, { useState } from "react";
import { motion } from "framer-motion";
import LoadingUser from "@/components/LoadingUser";

const ChangePasswordContent: React.FC = () => {
  const { refreshAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const { bgRed } = COLORS;
  const [api, contextHolder] = notification.useNotification();

  const [formData, setFormData] = useState<ResetPassword>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const reset = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };
  const handleUpdatePassword = async () => {
    setLoading(true);
    try {
      const response: ApiResponse<any> =
        await userService.changePassword(formData);

      if (!response.isSuccess) {
        api.error({ title: response.message, duration: 2 });
        setLoading(false);
        return;
      }

      api.success({ title: "Update password successfully", duration: 2 });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await refreshAuth();
      reset();
    } catch (err) {
      console.log(err);
      api.error({ title: "Failed to update password", duration: 2 });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          {loading && <LoadingUser />}
          <h2 className="text-2xl font-bold mb-6">Change Password</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                value={formData.confirmNewPassword}
                name="confirmNewPassword"
                onChange={handleChange}
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444]"
              />
            </div>
            <button
              className={`${bgRed} text-white px-6 py-2 rounded hover:bg-red-600 transition`}
              onClick={handleUpdatePassword}
            >
              Update Password
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ChangePasswordContent;
