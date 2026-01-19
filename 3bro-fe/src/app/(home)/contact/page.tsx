import React from "react";

// ==========================================
// ICONS (Được trích xuất từ SVG gốc)
// ==========================================

const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M22 16.92V19.92C22.0011 20.1986 21.9441 20.4742 21.8325 20.7294C21.7209 20.9846 21.5573 21.2137 21.3521 21.4019C21.1468 21.5902 20.9046 21.7336 20.6411 21.8228C20.3775 21.912 20.0987 21.945 19.823 21.92C16.7669 21.5857 13.8298 20.5386 11.24 18.84C8.83536 17.2476 6.75243 15.1646 5.16 12.76C3.4614 10.1702 2.41431 7.2331 2.08 4.177C2.05503 3.90131 2.08796 3.62248 2.17717 3.35894C2.26638 3.09541 2.40982 2.85317 2.59807 2.64794C2.78633 2.4427 3.01541 2.27909 3.27063 2.16749C3.52584 2.05589 3.80143 1.99886 4.08 2H7.08C7.56393 1.99845 8.03276 2.17365 8.39402 2.49115C8.75528 2.80866 8.98442 3.24687 9.04 3.72C9.14231 4.68479 9.37696 5.63325 9.74 6.54C9.88642 6.9122 9.91639 7.31887 9.82634 7.70915C9.73629 8.09943 9.53033 8.4565 9.23 8.74L7.46 10.51C9.42863 13.9882 12.0118 16.5714 15.49 18.54L17.26 16.77C17.5435 16.4697 17.9006 16.2637 18.2909 16.1737C18.6811 16.0836 19.0878 16.1136 19.46 16.26C20.3667 16.623 21.3152 16.8577 22.28 16.96C22.7531 17.0156 23.1913 17.2447 23.5088 17.606C23.8263 17.9672 24.0015 18.4361 24 18.92V21.92H22V16.92Z"
      fill="currentColor"
    />
  </svg>
);

const EmailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" />
    <path d="M22 6L12 13L2 6" />
  </svg>
);

// ==========================================
// MAIN COMPONENT
// ==========================================

const ContactUsContent: React.FC = () => {
  // Màu đỏ chủ đạo từ SVG (#DB4444)
  const redColor = "bg-[#DB4444]";
  const textGray = "text-[#4B5563]";
  const bgGray = "bg-[#F3F4F6]";

  return (
    <div className="font-inter bg-white py-20">
      <div className="container mx-auto px-4 lg:px-[135px]">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-black text-[32px] font-bold mb-4">Contact Us</h1>
          <p className={`${textGray} text-base`}>
            We love to hear from you. Please fill out the form below or use our
            contact details.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* ================= LEFT SIDE: CONTACT FORM ================= */}
          <div className="lg:col-span-2">
            <form className="space-y-6">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name *"
                  className={`w-full ${bgGray} rounded px-4 py-3 outline-none focus:ring-1 focus:ring-[#DB4444]`}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  className={`w-full ${bgGray} rounded px-4 py-3 outline-none focus:ring-1 focus:ring-[#DB4444]`}
                  required
                />
              </div>
              {/* Subject Row */}
              <input
                type="text"
                placeholder="Subject"
                className={`w-full ${bgGray} rounded px-4 py-3 outline-none focus:ring-1 focus:ring-[#DB4444]`}
              />
              {/* Message Row */}
              <textarea
                placeholder="Your Message"
                rows={8} // Tương đương chiều cao 200px trong SVG
                className={`w-full ${bgGray} rounded px-4 py-3 outline-none focus:ring-1 focus:ring-[#DB4444] resize-none`}
              ></textarea>
              {/* Submit Button */}
              <button
                type="submit"
                className={`${redColor} text-white font-medium px-12 py-3 rounded hover:bg-red-600 transition-colors`}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* ================= RIGHT SIDE: CONTACT INFO ================= */}
          <div className="lg:col-span-1 space-y-10 lg:pl-12">
            {/* Call To Us */}
            <div className="flex items-start space-x-4">
              <div
                className={`${redColor} p-3 rounded-full flex-shrink-0 flex items-center justify-center`}
              >
                <PhoneIcon className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-black">Call To Us</h3>
                <p className={`${textGray} text-sm`}>
                  We are available 24/7, 7 days a week.
                </p>
                <p className="text-base font-medium text-black">
                  Phone: +84-2882-6789
                </p>
              </div>
            </div>

            {/* Separator Line */}
            <hr className="border-[#E5E7EB]" />

            {/* Write To Us */}
            <div className="flex items-start space-x-4">
              <div
                className={`${redColor} p-3 rounded-full flex-shrink-0 flex items-center justify-center`}
              >
                <EmailIcon className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-black">
                  Write To Us
                </h3>
                <p className={`${textGray} text-sm`}>
                  Fill out our form and we will contact you within 24 hours.
                </p>
                <p className="text-base font-medium text-black break-all">
                  Emails: 3bro.sup.service@gmail.com
                </p>
                <p className="text-base font-medium text-black">
                  Address: Thu Dau Mot Ward, Ho Chi Minh City
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsContent;
