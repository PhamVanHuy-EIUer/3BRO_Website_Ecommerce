"use client";

import { GoogleIcon } from "@/data/icon";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import axiosClient from "@/lib/axios";
import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";

function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosClient.post("/Auth/login", {
        email,
        password,
      });

      const token = res.data?.string;
      if (!token) {
        throw new Error("Token not found");
      }

      // Lưu JWT
      // Cookies.set("access_token", token, {
      //   expires: 1,
      //   sameSite: "lax",
      // });

      // Redirect sau login
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Email or password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Google OAuth (sẽ làm sau)
    console.log("Google Sign In");
  };

  return (
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
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/3 p-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Log in</h2>

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

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-0 py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 placeholder-gray-400"
              />
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

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 hover:border-gray-400 rounded py-2 transition-colors"
            >
              <GoogleIcon />
              <span className="text-gray-700 font-medium">
                Sign up with Google
              </span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/signup" className="text-gray-600 hover:text-gray-800">
              Create a new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
