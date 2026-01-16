"use client";
import { createContext, useContext, useEffect, useState } from "react";
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
  const refreshAuth = async () => {
    try {
      const res = await userService.getMe();
      if (res.data.code === "200" && res.data.object) {
        setAuthorized(true);
        setUser(res.data.object);
        console.log("come here");
      } else {
        setAuthorized(false);
        setUser(null);
      }
    } catch {
      setAuthorized(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const login = async (data: LoginRequest) => {
    const res = await AuthService.login(data);
    if (res.data.code !== "200") {
      throw new Error(res.data.message);
    }

    await refreshAuth(); // ⭐ LẤY USER + ROLE
  };

  const logout = async () => {
    await AuthService.logout();
    setAuthorized(false);
    setUser(null);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

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
