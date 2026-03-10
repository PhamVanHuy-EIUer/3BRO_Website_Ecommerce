import { style } from "framer-motion/client";
import React from "react";

const AboutUsContent: React.FC = () => {
  // Màu xám placeholder từ SVG (#E5E7EB)
  const placeholderBg = "bg-[#E5E7EB]";
  // Màu text xám từ SVG (#4B5563)
  const textGray = "text-[#4B5563]";

  return (
    <div className="font-inter bg-white">
      <section
        className={`h-[550px] ${placeholderBg} flex flex-col items-center justify-center text-center px-4`}
        style={{
          backgroundImage: "url('/About/our_story.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        <h1 className="text-black text-5xl font-bold mb-4">OUR STORY</h1>
        <p className="text-black text-lg font-medium opacity-80">
          Crafting quality, delivering style.
        </p>
      </section>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      {/* Sử dụng padding lg:px-[135px] để mô phỏng khoảng cách lề như trong file SVG gốc */}
      <div className="container mx-auto px-4 lg:px-[135px] py-20 space-y-32">
        {/* ================= WHO WE ARE SECTION ================= */}
        <section className="flex flex-col lg:flex-row items-center gap-20">
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-black text-[32px] font-bold">Who We Are</h2>
            <div className={`${textGray} text-base leading-[1.6] space-y-6`}>
              <p>
                3BRO was founded with a simple mission: to provide high-quality
                products that combine style, comfort, and affordability. We
                believe that everyone deserves to look and feel their best,
                without breaking the bank.
              </p>
              <p>
                Our journey began in 2020, and since then, we've grown into a
                global community of fashion enthusiasts. We are committed to
                sustainability, ethical sourcing, and continuous innovation.
              </p>
            </div>
          </div>
          {/* Image Placeholder */}
          <div
            className={`lg:w-1/2 h-[350px] w-full rounded-lg ${placeholderBg}`}
            style={{
              backgroundImage: "url('/About/who_are_we.jpg')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </section>

        <section className="flex flex-col-reverse lg:flex-row-reverse items-center gap-20">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-black text-[32px] font-bold">Our Mission</h2>
            <div className={`${textGray} text-base leading-[1.6]`}>
              <p>
                Our mission is to empower individuals through fashion. We strive
                to create products that inspire confidence and self-expression.
                We are dedicated to providing exceptional customer service and
                building lasting relationships with our community.
              </p>
            </div>
          </div>
          {/* Image Placeholder */}
          <div
            className={`lg:w-1/2 h-[350px] w-full rounded-lg ${placeholderBg}`}
            style={{
              backgroundImage: "url('/About/our_mission.jpg')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </section>

        <section className="text-center">
          <h2 className="text-black text-[32px] font-bold mb-16">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center">
              {/* image person */}
              <div
                className={`w-[160px] h-[160px] rounded-full ${placeholderBg} mb-6`}
                style={{
                  backgroundImage: "url('/About/people1.jpg')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                }}
              ></div>
              <h3 className="text-black text-lg font-semibold">Hao Nguyen</h3>
              <p className={`${textGray} text-sm`}>Backend Developer</p>
            </div>
            {/* Team Member 2 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-[160px] h-[160px] rounded-full ${placeholderBg} mb-6`}
                style={{
                  backgroundImage: "url('/About/people2.jpg')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                }}
              ></div>
              <h3 className="text-black text-lg font-semibold">Huy Pham</h3>
              <p className={`${textGray} text-sm`}>Frontend Developer</p>
            </div>
            {/* Team Member 3 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-[160px] h-[160px] rounded-full ${placeholderBg} mb-6`}
                style={{
                  backgroundImage: "url('/About/people3.jpg')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                }}
              ></div>
              <h3 className="text-black text-lg font-semibold">Tan Nguyen</h3>
              <p className={`${textGray} text-sm`}>Project Manager</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUsContent;
