"use client";
import { notification } from "antd";
import { MailIcon, PhoneIcon } from "lucide-react";
import React, { useState } from "react";

const SupportRequestPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const redColor = "bg-[#DB4444]";
  const textGray = "text-[#4B5563]";
  const bgGray = "bg-[#F3F4F6]";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      api.warning({
        title: "Please fill in all required fields",
        placement: "topRight",
        duration: 2,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Demo: Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        api.success({
          title: "Support request submitted successfully",
          placement: "topRight",
          duration: 2,
        });
      }, 4000);
    } catch (error) {
      console.error("Error submitting support request:", error);
      api.error({
        title: "Failed to submit support request",
        placement: "topRight",
        duration: 2,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="font-sans bg-white py-20 min-h-screen">
        <div className="container mx-auto px-4 lg:px-32 max-w-7xl">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-black text-4xl font-bold mb-4">
              Support Request
            </h1>
            <p className={`${textGray} text-base`}>
              Need help? Send us a support request and our team will get back to
              you within 24 hours.
            </p>
          </div>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* LEFT SIDE: SUPPORT REQUEST FORM */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name *"
                      className={`w-full ${bgGray} rounded px-4 py-3 outline-none focus:ring-2 focus:ring-[#DB4444] transition-shadow`}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email *"
                      className={`w-full ${bgGray} rounded px-4 py-3 outline-none focus:ring-2 focus:ring-[#DB4444] transition-shadow`}
                    />
                  </div>
                </div>

                {/* Subject Row */}
                <div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject *"
                    className={`w-full ${bgGray} rounded px-4 py-3 outline-none focus:ring-2 focus:ring-[#DB4444] transition-shadow`}
                  />
                </div>

                {/* Message Row */}
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your issue or question in detail *"
                    rows={8}
                    className={`w-full ${bgGray} rounded px-4 py-3 outline-none focus:ring-2 focus:ring-[#DB4444] resize-none transition-shadow`}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`${redColor} text-white font-medium px-12 py-3 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Request</span>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: CONTACT INFO */}
            <div className="lg:col-span-1 space-y-10 lg:pl-12">
              {/* Call To Us */}
              <div className="flex items-start space-x-4">
                <div
                  className={`${redColor} p-3 rounded-full flex-shrink-0 flex items-center justify-center`}
                >
                  <PhoneIcon className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-black">
                    Call To Us
                  </h3>
                  <p className={`${textGray} text-sm`}>
                    We are available 24/7, 7 days a week.
                  </p>
                  <p className="text-base font-medium text-black">
                    Phone: +84-2882-6789
                  </p>
                </div>
              </div>

              {/* Separator Line */}
              <hr className="border-gray-200" />

              {/* Write To Us */}
              <div className="flex items-start space-x-4">
                <div
                  className={`${redColor} p-3 rounded-full flex-shrink-0 flex items-center justify-center`}
                >
                  <MailIcon className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-black">
                    Write To Us
                  </h3>
                  <p className={`${textGray} text-sm`}>
                    Fill out our form and we will contact you within 24 hours.
                  </p>
                  <p className="text-base font-medium text-black break-all">
                    Email: 3bro.sup.service@gmail.com
                  </p>
                  <p className="text-base font-medium text-black">
                    Address: Thu Dau Mot Ward, Ho Chi Minh City
                  </p>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                <h4 className="text-blue-900 font-semibold mb-2">
                  Support Hours
                </h4>
                <p className="text-blue-800 text-sm">
                  Our team typically responds within 2-4 hours during business
                  hours (9 AM - 6 PM GMT+7).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportRequestPage;
