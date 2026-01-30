"use client";

import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notification } from "antd";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/models/ApiResponse";
import { AuthService } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

const SetupPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const { refreshAuth } = useAuth();

  // Validate password requirements
  const isPasswordValid = password.length >= 8;
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";
  const allValid = isPasswordValid && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      api.warning({
        message: "Setup Password",
        description: "Please enter password and confirm password",
        duration: 2,
      });
      return;
    }

    if (!isPasswordValid) {
      api.warning({
        title: "Invalid Password",
        description: "Password must be at least 8 characters",
        duration: 2,
      });
      return;
    }

    if (!passwordsMatch) {
      api.warning({
        title: "Password Mismatch",
        description: "Passwords do not match",
        duration: 2,
      });
      return;
    }

    try {
      setLoading(true);
      const res: ApiResponse<any> = await AuthService.createPasswordForGoogle(
        password,
        confirmPassword,
      );
      console.log(res);
      if (!res.isSuccess) {
        api.error({
          title: "Setup Password Error",
          description: res.message || "Failed to create password",
          duration: 2,
        });
        return;
      }
      api.success({
        title: "Success",
        description: "Password created successfully",
        duration: 2,
      });
      await refreshAuth();
      // Redirect after success
      router.push("/");
    } catch (err: any) {
      api.error({
        title: "Setup Password Error",
        description: err.response?.data?.message || "Failed to create password",
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="h-[80vh] bg-gray-50 flex items-center justify-center p-4">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl w-full h-[50vh]">
          {/* Left Side */}
          <div className="w-2/3 p-12 items-center justify-center hidden md:flex">
            <div className="relative w-full h-full">
              <Image
                alt="logo"
                src="/Login/LogoLogin.png"
                fill
                className="object-contain"
                sizes="50vw"
                priority
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/3 p-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Setup Password
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              Create a strong password to protect your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Input */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-0 py-2 pr-10 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 placeholder-gray-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {/* Password length validation */}
                {password && (
                  <p
                    className={`mt-2 text-sm flex items-center gap-1 ${isPasswordValid ? "text-green-600" : "text-gray-500"}`}
                  >
                    {isPasswordValid ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    At least 8 characters ({password.length}/8)
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-0 py-2 pr-10 border-b-2 outline-none text-gray-700 placeholder-gray-400 transition-colors ${
                      confirmPassword && !passwordsMatch
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    Password does not match
                  </p>
                )}
                {passwordsMatch && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Password matched
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={!allValid || loading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetupPassword;
