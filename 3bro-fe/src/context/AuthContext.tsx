"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { userService } from "@/services/user.service";
import { AuthService } from "@/services/auth.service";
import { LoginRequest } from "@/models/LoginRequest";
import { User } from "@/models/User";
import { i } from "framer-motion/client";

type AuthContextType = {
  authorized: boolean;
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const isAdmin = user?.roleList?.includes("Admin") ?? false;

  const refreshAuth = useCallback(async () => {
    try {
      const res = await userService.getMe();
      if (res.code === "200" && res.object) {
        setAuthorized(true);
        setUser(res.object);
        console.log("Auth refreshed, user:", res.object);
      } else {
        setAuthorized(false);
        setUser(null);
      }
    } catch (error) {
      console.log("Refresh auth failed:", error);
      setAuthorized(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await AuthService.login(data);
    if (res.code !== "200") {
      throw new Error(res.message);
    }

    await refreshAuth();
    console.log("Login successful, user:", user);
  };

  const loginWithGoogle = async (idToken: string) => {
    const res = await AuthService.loginWithGoogle(idToken);
    if (res.code !== "200") {
      throw new Error(res.message);
    }
    if (res.isSuccess) {
      console.log(res);
      await refreshAuth();
    }
  };

  const logout = async () => {
    const res = await AuthService.logout();
    if (res.code !== "200") {
      throw new Error(res.message);
    }
    setAuthorized(false);
    setUser(null);
    console.log("Logout successful", res);
  };

  // Fetch user khi mount
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // THÊM: Định kỳ refresh auth mỗi 5 phút để đảm bảo sync với token
  useEffect(() => {
    if (!authorized) return;

    const interval = setInterval(
      () => {
        console.log("Periodic auth refresh...");
        refreshAuth();
      },
      15 * 60 * 1000,
    ); // 5 phút

    return () => clearInterval(interval);
  }, [authorized, refreshAuth]);

  // THÊM: Listen cho token refresh event từ axios interceptor
  useEffect(() => {
    const handleTokenRefresh = () => {
      console.log("Token refreshed, updating user...");
      refreshAuth();
    };

    // Custom event từ axios interceptor
    window.addEventListener("token-refreshed", handleTokenRefresh);

    return () => {
      window.removeEventListener("token-refreshed", handleTokenRefresh);
    };
  }, [refreshAuth]);

  return (
    <AuthContext.Provider
      value={{
        authorized,
        loading,
        user,
        isAdmin,
        login,
        logout,
        loginWithGoogle,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
