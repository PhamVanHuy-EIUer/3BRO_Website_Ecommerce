"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notification } from "antd";
import { ApiResponse } from "@/models/ApiResponse";
import { User } from "@/models/User";
import { userService } from "@/services/user.service";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "@/context/AuthContext";

function CreateAccountPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginWithGoogle, user } = useAuth();

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      notification.warning({
        message: "Missing information",
        description: "Email and password are required",
        duration: 5,
      });
      return;
    }

    try {
      setLoading(true);

      const res = await userService.register({
        email,
        password,
      });
      const data = res.data as ApiResponse<User>;

      if (!data.isSuccess) {
        notification.error({
          message: data.message || "Sign up failed",
          description: "Input is invalid",
          duration: 5,
        });
        return;
      }

      notification.success({
        message: "Account created successfully",
        description: "Please check your email to activate your account",
      });
      if (!data.object?.id) {
        notification.error({
          message: "Sign up failed",
          description: "User ID not returned from server",
        });
        return;
      }

      router.push(`/active?id=${data.object.id}`);
    } catch {
      notification.error({
        message: "System error",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    try {
      setLoading(true);

      const result = await loginWithGoogle(credential);

      if (result === "SETUP_PASSWORD") return;

      const isAdmin = user?.roleList?.includes("Admin") ?? false;

      router.replace(isAdmin ? "/admin" : "/");
    } catch (err) {
      console.error("Google login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    notification.error({
      title: "Login with Google error",
      description: "Login failed",
    });
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
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-0 py-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 placeholder-gray-400 text-base"
              />
            </div>

            {/* Password field với toggle hiện/ẩn */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-0 py-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 placeholder-gray-400 text-base pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  /* Eye-off icon: đang hiện → click để ẩn */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7a9.77 9.77 0 012.168-3.831M6.343 6.343A9.956 9.956 0 0112 5c5 0 9 4 9 7a9.77 9.77 0 01-1.585 2.895M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18"
                    />
                  </svg>
                ) : (
                  /* Eye icon: đang ẩn → click để hiện */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-md transition-colors"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="mt-6 flex justify-center">
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
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
