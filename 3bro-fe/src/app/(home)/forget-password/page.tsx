"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { notification } from "antd";
import { Mail, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { ApiResponse } from "@/models/ApiResponse";
import { userService } from "@/services/user.service";

function ForgetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [isConfirmActive, setIsConfirmActive] = useState(false);
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email);
    if (!email) {
      api.error({
        title: "Missing information",
        description: "Email is required",
        duration: 3,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      api.error({
        title: "Invalid email",
        description: "Please enter a valid email address",
        duration: 3,
      });
      return;
    }

    try {
      setLoading(true);

      const res: ApiResponse<any> = await userService.forgetPassword(email);
      console.log(res);

      if (!res.isSuccess) {
        api.error({
          title: "Error",
          description: res.message || "Failed to send reset code",
          duration: 5,
        });
        return;
      }
      setEmailSent(true);
      api.success({
        title: "Email sent successfully",
        description: res.message || "Active code has been sent to your email",
        duration: 5,
      });
    } catch (err: any) {
      api.error({
        title: "Error",
        description: err.message || "Failed to send reset code",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      api.error({
        title: "Missing information",
        description: "Code is required",
        duration: 3,
      });
      return;
    }

    try {
      setLoading(true);
      console.log(code + " " + email);

      const res: ApiResponse<any> = await userService.checkOtpForgetPassword(
        email,
        code,
      );

      if (!res.isSuccess) {
        console.log(res);
        api.error({
          title: "Error",
          description: res.message || "Failed to confirm code",
          duration: 3,
        });
        return;
      }

      setIsConfirmActive(true);
      api.success({
        title: "Code confirmed successfully",
        description: res.message || "You can now reset your password",
        duration: 3,
      });
    } catch (err: any) {
      console.log(err);
      api.error({
        title: "Error",
        description: err.message || "Failed to confirm code",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      api.error({
        title: "Missing information",
        description: "Password and confirm password are required",
        duration: 3,
      });
      return;
    }

    if (password !== confirmPassword) {
      api.error({
        title: "Password mismatch",
        description: "Passwords do not match",
        duration: 3,
      });
      return;
    }

    try {
      setLoading(true);

      const res: ApiResponse<any> = await userService.updateForForgetPassword(
        email,
        password,
        confirmPassword,
      );

      if (!res.isSuccess) {
        api.error({
          title: "Error",
          description: res.message || "Failed to reset password",
          duration: 5,
        });
        return;
      }

      api.success({
        title: "Password reset successfully",
        description: res.message || "You can now login with your new password",
        duration: 5,
      });
      router.push("/login");
    } catch (err: any) {
      api.error({
        title: "Error",
        description: err.message || "Failed to reset password",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 ">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl w-full min-h-[50vh]">
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
          <div className="w-full md:w-1/3 p-12  flex items-center">
            {!emailSent && (
              <>
                <div className="flex-col">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Link>

                  <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                    Forget Password
                  </h2>

                  <p className="text-gray-600 mb-8">
                    {emailSent
                      ? "We've sent a reset code to your email. Please check your inbox."
                      : "Enter your email address and we'll send you a code to reset your password."}
                  </p>

                  <form onSubmit={handleSendCode} className="space-y-6">
                    <div className="relative">
                      <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-8 pr-0 py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 placeholder-gray-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending..." : "Send Reset Code"}
                    </button>
                  </form>

                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                      Remember your password?{" "}
                      <Link
                        href="/login"
                        className="text-red-500 hover:text-red-600 font-medium"
                      >
                        Log in
                      </Link>
                    </p>
                  </div>
                </div>
              </>
            )}
            {emailSent && !isConfirmActive && (
              <>
                <div className="block">
                  <div className="flex flex-col justify-center">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                      Enter Reset Code
                    </h2>

                    <p className="text-gray-600 mb-8">
                      We've sent a reset code to your email. Please check your
                      inbox.
                    </p>

                    <form onSubmit={handleConfirmCode} className="space-y-6">
                      <div className="relative">
                        <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={8}
                          placeholder="Enter reset code"
                          value={code}
                          onChange={(e) =>
                            setCode(e.target.value.replace(/\D/g, ""))
                          }
                          className="w-full pl-8 pr-0 py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Sending..." : "Confirm Code"}
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
            {emailSent && isConfirmActive && !isConfirmPassword && (
              <>
                <div className="flex flex-col justify-center">
                  <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                    Enter New Password
                  </h2>

                  <p className="text-gray-600 mb-8">
                    Please enter your new password.
                  </p>

                  <form onSubmit={handleResetPassword} className="space-y-6">
                    {/* Password Field */}
                    <div className="relative">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-8 pr-10 py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 placeholder-gray-400"
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

                    {/* Confirm Password Field */}
                    <div className="relative">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-8 pr-10 py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending..." : "Reset Password"}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgetPasswordPage;
