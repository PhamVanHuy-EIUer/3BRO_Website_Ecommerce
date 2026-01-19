"use client";
import React, { useState } from "react";

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 18L18 6M6 6L18 18"
      stroke="#DB4444"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronUp: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 15L12 9L6 15" />
  </svg>
);

const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 9L12 15L18 9" />
  </svg>
);

// ==========================================
// MAIN COMPONENT
// ==========================================

const CartContent: React.FC = () => {
  // Mock Data State
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Stylish Jacket", price: 150, quantity: 1 },
    { id: 2, name: "Comfort Sneakers", price: 80, quantity: 2 },
  ]);

  // Handle Quantity Change
  const handleQuantityChange = (id: number, change: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );
  };

  // Handle Remove Item
  const handleRemoveItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  // Calculate Totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const total = subtotal; // Free shipping

  return (
    <div className="font-inter bg-white py-10">
      <div className="container mx-auto px-4 lg:px-[135px]">
        {/* Breadcrumb */}
        <div className="text-sm mb-10 flex items-center">
          <span className="text-[#4B5563]">Home</span>
          <span className="mx-2 text-[#4B5563]">/</span>
          <span className="font-medium text-black">Cart</span>
        </div>

        <h1 className="text-3xl font-bold text-black mb-10">Cart</h1>

        {/* Cart Table Section */}
        <div className="mb-12 overflow-x-auto">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 bg-[#F3F4F6] py-4 px-6 rounded mb-6 text-black font-medium min-w-[800px]">
            <div className="col-span-5">Product</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Subtotal</div>
            <div className="col-span-1">Action</div>
          </div>

          {/* Cart Items List */}
          <div className="space-y-6 min-w-[800px]">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 items-center bg-white border border-[#E5E7EB] p-4 rounded shadow-sm relative"
              >
                {/* Product Info */}
                <div className="col-span-5 flex items-center space-x-4">
                  {/* Image placeholder */}
                  <div className="w-[60px] h-[60px] bg-[#F3F4F6] rounded flex-shrink-0"></div>
                  <span className="font-medium text-black">{item.name}</span>
                </div>

                {/* Price */}
                <div className="col-span-2">
                  <span className="text-black">${item.price}</span>
                </div>

                {/* Quantity Control */}
                <div className="col-span-2 flex items-center">
                  <div className="flex items-center border border-[#E5E7EB] bg-[#F3F4F6] rounded px-3 py-2 w-[80px] justify-between">
                    <span className="font-medium">{item.quantity}</span>
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="hover:text-gray-600"
                      >
                        <ChevronUp />
                      </button>
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="hover:text-gray-600"
                      >
                        <ChevronDown />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="col-span-2 font-medium text-black">
                  <span>${item.price * item.quantity}</span>
                </div>

                {/* Remove Action */}
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-[#DB4444] hover:text-red-700 transition"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Actions Buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4 min-w-[800px]">
            <button className="px-8 py-3 border-2 border-[#DB4444] text-[#DB4444] font-medium rounded hover:bg-red-50 text-center transition bg-white">
              Continue Shopping
            </button>
            <button className="px-8 py-3 border-2 border-[#DB4444] text-[#DB4444] font-medium rounded hover:bg-red-50 transition bg-white">
              Update Cart
            </button>
          </div>
        </div>

        {/* Bottom Section: Coupon & Totals */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 items-start">
          {/* Coupon Section */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Coupon Code"
              className="border border-[#E5E7EB] rounded px-4 py-3 outline-none flex-grow lg:w-[300px] text-black placeholder-[#9CA3AF]"
            />
            <button className="bg-[#DB4444] text-white font-medium px-8 py-3 rounded hover:bg-red-600 transition whitespace-nowrap">
              Apply Coupon
            </button>
          </div>

          {/* Cart Total Box */}
          <div className="border border-[#E5E7EB] rounded p-6 w-full lg:w-[470px]">
            <h2 className="text-xl font-bold text-black mb-6">Cart Total</h2>
            <div className="space-y-4 text-black">
              <div className="flex justify-between py-3 border-b border-[#E5E7EB]">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#E5E7EB]">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-medium">Total</span>
                <span className="font-bold text-[#DB4444] text-lg">
                  ${total}
                </span>
              </div>
            </div>
            <button className="block w-full bg-[#DB4444] text-white text-center font-medium px-8 py-3 rounded hover:bg-red-600 transition mt-6">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
