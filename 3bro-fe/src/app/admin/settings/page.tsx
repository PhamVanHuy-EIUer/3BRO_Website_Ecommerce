"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  Camera,
  X,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  Globe,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, notification } from "antd";
import { use } from "framer-motion/m";
import { ApiResponse } from "@/models/ApiResponse";
import { userService } from "@/services/user.service";
import { User } from "@/models/User";
import { UpdateProfile } from "@/models/UpdateProfile";

const AdminSettings = () => {
  const { user, refreshAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications" | "preferences"
  >("profile");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [longtitude, setLongtitude] = useState<number>(user?.latitude || 11.02);
  const [latitude, setLatitude] = useState<number>(user?.longtitude || 106.68);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  // Form states
  const [formData, setFormData] = useState({
    fullName: user?.fullName,
    email: user?.email,
    phone: user?.phone,
    jobTitle: "Store Administrator",
    company: "E-Commerce Hub",
    bio: "Experienced e-commerce manager with a passion for customer satisfaction and business growth.",
    website: "https://ecommerce-hub.co",
    location: user?.address,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setAvatarUrl(reader.result as string);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  //   const handleRemovePhoto = () => {
  //     setAvatarUrl(null);
  //   };

  const handleUpdateProfile = async () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.location ||
      !latitude ||
      !longtitude
    ) {
      api.warning({
        title: "Warning",
        description: "Please fill in all required fields",
        duration: 2,
      });
      return;
    }
    try {
      setLoading(true);
      const update: UpdateProfile = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.location,
        latitude: latitude,
        longtitude: longtitude,
      };
      const res: ApiResponse<any> = await userService.updateProfile(update);

      if (!res.isSuccess && res.code !== "200") {
        api.error({
          title: "Error",
          description: res.message,
          duration: 2,
        });
        return;
      }
      if (res.isSuccess) {
        await refreshAuth();
        api.success({
          title: "Success",
          description: "Update profile successfully",
          placement: "topRight",
          duration: 2,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!formData.fullName && !user?.fullName) return "AU";
    const name = formData.fullName || user?.fullName || "";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, name.length > 2 ? 2 : name.length);
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="w-5 h-5 text-gray-600" />
                    <h1 className="text-2xl font-bold text-gray-800">
                      Profile Settings
                    </h1>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Manage your account settings, security preferences, and
                    notifications.
                  </p>
                </div>
                <button
                  onClick={() => window.history.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 px-6 overflow-x-auto">
              {["profile", "security", "notifications", "preferences"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as typeof activeTab)}
                    className={`py-4 px-2 font-medium text-sm whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ),
              )}
            </div>
          </motion.div>

          {/* Content */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            >
              {/* Personal Information Header */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Personal Information
                </h2>
                <p className="text-gray-500 text-sm">
                  Update your personal details and profile information
                </p>
              </div>

              {/* Avatar Section */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                <div className="relative">
                  <Avatar
                    size={96}
                    src={avatarUrl}
                    style={{
                      backgroundColor: avatarUrl ? "transparent" : "#1890ff",
                      fontSize: "32px",
                      fontWeight: "bold",
                    }}
                  >
                    {!avatarUrl && getInitials()}
                  </Avatar>
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      // onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {/* <div className="flex gap-3">
                <label
                  htmlFor="photo-upload-btn"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span className="text-sm font-medium">Change Photo</span>
                  <input
                    id="photo-upload-btn"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleRemovePhoto}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                >
                  Remove Photo
                </button>
              </div> */}
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Admin User"
                    />
                  </div>
                </div>

                {/* Email & Phone Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="admin@ecommerce.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Job Title & Company Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Store Administrator"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="E-Commerce Hub"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                {/* Website & Location Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="https://ecommerce-hub.co"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="New York, NY"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  Update Profile
                </button>
              </div>
            </motion.div>
          )}

          {/* Other Tabs Placeholder */}
          {activeTab !== "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            >
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                  Settings
                </h3>
                <p className="text-gray-500">
                  This section is under development
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
