"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { notification } from "antd";
import { userService } from "@/services/user.service";

function ActiveAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("id");

  const [activationCode, setActivationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  // return to signup
  useEffect(() => {
    if (!userId) {
      api.error({
        message: "Invalid activation link",
        description: "Please sign up again",
      });
      router.replace("/signup");
    }
  }, [userId, router]);

  // active
  const handleActivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId === null) return;

    if (!activationCode) {
      api.warning({
        message: "Missing information",
        description: "Activation code is required",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await userService.activeUser(userId, activationCode.trim());

      if (!res.data?.isSuccess) {
        notification.error({
          message: res.data?.message || "Activation failed",
        });
        return;
      }

      notification.success({
        message: "Account activated successfully",
        description: "You can now log in",
      });

      router.replace("/login");
    } catch {
      notification.error({
        message: "System error",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  // resend
  const handleResendCode = async () => {
    if (!userId) return;

    try {
      setResendLoading(true);

      const res = await userService.sendActiveCode(userId);

      if (!res.data?.isSuccess) {
        notification.error({
          message: res.data?.message || "Failed to resend activation code",
        });
        return;
      }

      notification.success({
        message: "Activation code resent",
        description: "Please check your email",
      });
    } catch {
      notification.error({
        message: "System error",
        description: "Please try again later",
      });
    } finally {
      setResendLoading(false);
    }
  };

  // ================= UI =================
  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl w-full">
          {/* Left */}
          <div className="w-2/3 p-12 hidden md:flex items-center justify-center">
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

          {/* Right */}
          <div className="w-full md:w-1/2 p-16">
            <h2 className="text-4xl font-semibold text-gray-800 mb-4">
              Activate your account
            </h2>
            <p className="text-gray-600 mb-12">
              Please enter the activation code sent to your email
            </p>

            <form onSubmit={handleActivateAccount} className="space-y-6">
              <input
                type="text"
                placeholder="Enter activation code"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                className="w-full px-0 py-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-md text-white
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }
              `}
              >
                {loading ? "Activating..." : "Activate Account"}
              </button>
            </form>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 font-medium mb-3">
                Didn't receive the code?
              </p>

              <button
                onClick={handleResendCode}
                disabled={resendLoading}
                className="w-full border-2 border-gray-300 hover:border-gray-400 py-2 rounded-md disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "Resend Activation Code"}
              </button>
            </div>

            <div className="mt-6 text-center">
              <span className="text-gray-600">Already activated? </span>
              <Link href="/login" className="font-medium text-gray-800">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ActiveAccountPage;
