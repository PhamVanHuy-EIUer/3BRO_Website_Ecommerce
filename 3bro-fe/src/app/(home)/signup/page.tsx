"use client";

import Image from "next/image";
import { useState } from "react";
import { GoogleIcon } from "@/data/icon";
import Link from "next/link";

function CreateAccountPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create Account:", { name, email, password });
  };

  const handleGoogleSignUp = () => {
    console.log("Google Sign Up");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl w-full">
        {/* Left Side - Logo */}
        <div className="w-2/3 p-12 items-center justify-center hidden md:flex">
          <div className="relative w-full h-full">
            <Image
              alt="logo"
              src="/Login/LogoLogin.png"
              fill
              className="object-contain"
              sizes="50vw"
            />
          </div>
        </div>

        {/* Right Side - Create Account Form */}
        <div className="w-full md:w-1/2 p-16">
          <h2 className="text-4xl font-semibold text-gray-800 mb-12">
            Create an account
          </h2>

          <form onSubmit={handleCreateAccount} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-0 py-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 placeholder-gray-400 text-base"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Email or Phone Number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-0 py-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 placeholder-gray-400 text-base"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-0 py-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 placeholder-gray-400 text-base"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-md transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 hover:border-gray-400 rounded-md py-2.5 transition-colors bg-white"
            >
              <GoogleIcon />
              <span className="text-gray-700 font-medium">
                Sign up with Google
              </span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Already have account? </span>
            <Link
              href="/login"
              className="text-gray-800 hover:text-gray-900 font-medium"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountPage;
