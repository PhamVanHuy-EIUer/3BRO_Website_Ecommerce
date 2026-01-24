import React from "react";

const MyAccountPage: React.FC = () => {
  // Style chung cho các ô input
  // bg-[#F5F5F5]: Màu nền xám nhạt giống trong thiết kế
  const inputStyle =
    "w-full bg-[#F5F5F5] rounded px-4 py-3 outline-none text-sm text-black placeholder-gray-500 focus:ring-1 focus:ring-[#DB4444] transition-all";
  const labelStyle = "block text-black text-sm mb-2";

  return (
    <div className="font-inter bg-white min-h-screen py-10">
      <div className="container mx-auto px-4 lg:px-[135px]">
        {/* ================= TOP HEADER ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-16">
          {/* Breadcrumb */}
          <div className="text-sm mb-4 sm:mb-0">
            <span className="text-gray-500 hover:text-black cursor-pointer">
              Home
            </span>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-black font-medium">My Account</span>
          </div>
          {/* Welcome Message */}
          <div className="text-sm">
            <span className="text-black">Welcome! </span>
            <span className="text-[#DB4444]">Md Rimel</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
          {/* ================= LEFT SIDEBAR (My Profile Preview) ================= */}
          <div className="w-full lg:w-[250px] space-y-6">
            <h2 className="text-base font-medium text-black mb-4">
              My Profile
            </h2>

            {/* Các trường thông tin bên trái (Read-only view) */}
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-black mb-1 block">
                  First Name
                </label>
                <div className="bg-[#F5F5F5] rounded px-4 py-3 text-sm text-gray-600">
                  Hao
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-black mb-1 block">
                  Last Name
                </label>
                <div className="bg-[#F5F5F5] rounded px-4 py-3 text-sm text-gray-600">
                  Nguyen Hoang
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-black mb-1 block">
                  Email
                </label>
                <div className="bg-[#F5F5F5] rounded px-4 py-3 text-sm text-gray-600 overflow-hidden text-ellipsis">
                  haonguyenhaong8@gmail.com
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-black mb-1 block">
                  Address
                </label>
                <div className="bg-[#F5F5F5] rounded px-4 py-3 text-sm text-gray-600">
                  TP.Ho Chi Minh
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE: EDIT PROFILE FORM ================= */}
          <div className="flex-1 bg-white shadow-[0px_1px_10px_rgba(0,0,0,0.05)] border border-gray-100 rounded px-6 py-8 md:px-12 md:py-10 lg:px-16 lg:py-14">
            <h2 className="text-xl font-medium text-[#DB4444] mb-8">
              Edit Your Profile
            </h2>

            <form className="space-y-6">
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className={labelStyle}>First Name</label>
                  <input
                    type="text"
                    placeholder="Hao"
                    className={inputStyle}
                    defaultValue="Hao"
                  />
                </div>
                <div>
                  <label className={labelStyle}>Last Name</label>
                  <input
                    type="text"
                    placeholder="Nguyen Hoang"
                    className={inputStyle}
                    defaultValue="Nguyen Hoang"
                  />
                </div>
              </div>

              {/* Row 2: Email & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className={labelStyle}>Email</label>
                  <input
                    type="email"
                    placeholder="haonguyenhaong8@gmail.com"
                    className={inputStyle}
                    defaultValue="haonguyenhaong8@gmail.com"
                  />
                </div>
                <div>
                  <label className={labelStyle}>Address</label>
                  <input
                    type="text"
                    placeholder="TP.Ho Chi Minh"
                    className={inputStyle}
                    defaultValue="TP.Ho Chi Minh"
                  />
                </div>
              </div>

              {/* Password Changes Section */}
              <div className="space-y-4 pt-4">
                <label className="block text-black text-sm mb-1">
                  Password Changes
                </label>
                <input
                  type="password"
                  placeholder="Current Password"
                  className={inputStyle}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className={inputStyle}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className={inputStyle}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-6 pt-4">
                <button
                  type="button"
                  className="text-black text-sm font-medium hover:text-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#DB4444] text-white px-8 py-3 rounded text-sm font-medium hover:bg-red-600 transition shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
