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

type AuthContextType = {
  authorized: boolean;
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
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
      if (res.data.code === "200" && res.data.object) {
        setAuthorized(true);
        setUser(res.data.object);
        console.log("Auth refreshed, user:", res.data.object);
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
    if (res.data.code !== "200") {
      throw new Error(res.data.message);
    }

    await refreshAuth();
  };

  const logout = async () => {
    await AuthService.logout();
    setAuthorized(false);
    setUser(null);
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
      value={{ authorized, loading, user, isAdmin, login, logout, refreshAuth }}
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
