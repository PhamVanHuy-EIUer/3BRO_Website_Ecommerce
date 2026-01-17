"use client";
import { motion } from "framer-motion";

interface CardProps {
  name: string;
  icon: React.ElementType;
  value: string;
}
const Card = ({ name, icon: Icon, value }: CardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)" }}
      className=" bg-[#f5f5f5] backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-[#efefef]"
    >
      <div className="px-4 py-5 sm:p-6 ">
        <span className="flex items-center text-sm font-medium text-gray-500">
          <Icon size={20} className="mr-2" />
          {name}
        </span>
        <p className="mt-1 text-3xl font-semibold text-black">{value}</p>
      </div>
    </motion.div>
  );
};

export default Card;
