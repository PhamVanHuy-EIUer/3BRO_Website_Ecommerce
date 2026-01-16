import Link from "next/link";
import React from "react";

const Notification = () => {
  return (
    <div className="h-14 sm:h-8 bg-black text-white text-xs md:text-sm flex items-center justify-center text-center">
      <p className="">
        Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%{" "}
        <Link href="/" className="font-bold underline ">
          Shop Now
        </Link>
      </p>
    </div>
  );
};

export default Notification;
