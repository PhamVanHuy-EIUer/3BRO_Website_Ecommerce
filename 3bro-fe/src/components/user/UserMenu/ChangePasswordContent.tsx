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

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7a9.77 9.77 0 012.168-3.831M6.343 6.343A9.956 9.956 0 0112 5c5 0 9 4 9 7a9.77 9.77 0 01-1.585 2.895M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
  </svg>
);

const PasswordInput: React.FC<{
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}> = ({ name, value, onChange, label }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={show ? "text" : "password"}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:border-[#DB4444]"
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
};

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
        api.error({ message: response.message, duration: 2 });
        setLoading(false);
        return;
      }

      api.success({ message: "Update password successfully", duration: 2 });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await refreshAuth();
      reset();
    } catch (err) {
      console.log(err);
      api.error({ message: "Failed to update password", duration: 2 });
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
            <PasswordInput
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              label="Current Password"
            />
            <PasswordInput
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              label="New Password"
            />
            <PasswordInput
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              label="Confirm New Password"
            />
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
