"use client";

import { GoogleIcon } from "@/data/icon";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginRequest } from "@/models/LoginRequest";
import { notification } from "antd";
import { useAuth } from "@/context/AuthContext";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Eye, EyeOff } from "lucide-react";
import { m } from "framer-motion";

function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, user, contextHolder } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      notification.error({
        title: "Missing information",
        description: "Email and password are required",
        duration: 5,
      });
      return;
    }

    try {
      setLoading(true);
      const loginRequest: LoginRequest = { email, password };
      await login(loginRequest);

      const isAdmin = user?.roleList?.includes("Admin") ?? false;
      await delay(2000);
      if (isAdmin) {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    console.log("Received Google credential");

    try {
      setLoading(true);
      await loginWithGoogle(credential);
      await delay(2000);
      const isAdmin = user?.roleList?.includes("Admin") ?? false;

      if (isAdmin) {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch (err: any) {
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
    <>
      {contextHolder}
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl w-full">
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
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">
              Log in
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Email or Phone Number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-0 py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 placeholder-gray-400"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-0 py-2 pr-10 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 placeholder-gray-400"
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

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-2 rounded transition-colors disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>

                <Link
                  href="/forgot-password"
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  Forget Password?
                </Link>
              </div>
            </form>

            {/* Google Sign-In */}
            <div className="mt-6 flex justify-center">
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/signup"
                className="text-gray-600 hover:text-gray-800"
              >
                Create a new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
