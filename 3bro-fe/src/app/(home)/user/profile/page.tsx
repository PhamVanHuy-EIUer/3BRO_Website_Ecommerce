"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import { UpdateProfile } from "@/models/UpdateProfile";
import { ResetPassword } from "@/models/ResetPassword";
import { User } from "@/models/User";

const UserProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Profile Form State
  const [profileData, setProfileData] = useState<UpdateProfile>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState<ResetPassword>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await userService.updateProfile(profileData);

      // Refresh user data
      const response = await userService.getMe();
      if (response.data) {
        setUser(response.data);
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setLoading(false);
      return;
    }

    // Validate password strength (optional)
    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      setLoading(false);
      return;
    }

    try {
      await userService.changePassword(passwordData);
      setMessage({ type: "success", text: "Password changed successfully!" });

      // Clear password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to change password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-inter bg-[#F9FAFB] min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">
            Manage your profile and security settings
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab("profile");
                setMessage({ type: "", text: "" });
              }}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "profile"
                  ? "bg-[#DB4444] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-5 h-5 inline-block mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile Information
            </button>
            <button
              onClick={() => {
                setActiveTab("password");
                setMessage({ type: "", text: "" });
              }}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "password"
                  ? "bg-[#DB4444] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-5 h-5 inline-block mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Change Password
            </button>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div
              className={`mx-6 mt-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <div className="flex items-center">
                {message.type === "success" ? (
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="p-6">
            {activeTab === "profile" ? (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DB4444] focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DB4444] focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DB4444] focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DB4444] focus:border-transparent outline-none resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#DB4444] text-white px-8 py-3 rounded-lg hover:bg-[#C43E3E] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DB4444] focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DB4444] focus:border-transparent outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmNewPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DB4444] focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#DB4444] text-white px-8 py-3 rounded-lg hover:bg-[#C43E3E] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
