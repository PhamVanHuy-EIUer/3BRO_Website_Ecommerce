"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactElement,
  JSXElementConstructor,
} from "react";
import { userService } from "@/services/user.service";
import { AuthService } from "@/services/auth.service";
import { LoginRequest } from "@/models/LoginRequest";
import { User } from "@/models/User";
import { useRouter } from "next/navigation";
import { notification } from "antd";
import { ApiResponse } from "@/models/ApiResponse";

type AuthContextType = {
  authorized: boolean;
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
  contextHolder: ReactElement<unknown, string | JSXElementConstructor<any>>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<string>;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  // Refresh auth
  const refreshAuth = useCallback(async () => {
    try {
      const res: ApiResponse<User> = await userService.getMe();

      if (res.code === "200" && res.object) {
        setAuthorized(true);
        setUser(res.object);

        const admin = res.object.roleList?.includes("Admin") ?? false;
        setIsAdmin(admin);
      } else {
        setAuthorized(false);
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.log("Refresh auth failed:", error);
      setAuthorized(false);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (data: LoginRequest) => {
    try {
      const res = await AuthService.login(data);

      if (res.code !== "200") {
        throw new Error(res.message);
      }

      api.success({
        title: "Success",
        description: "Login successfully",
        duration: 2,
      });

      await refreshAuth();
    } catch (error: any) {
      api.error({
        title: "Login error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Email or password is incorrect",
      });

      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async (idToken: string) => {
    try {
      const res = await AuthService.loginWithGoogle(idToken);

      if (res.code === "201") {
        router.push("/setup-password");
        return "SETUP_PASSWORD";
      }

      if (res.code === "200") {
        api.success({
          title: "Success",
          description: "Login successfully",
          duration: 2,
        });

        await refreshAuth();
        return "LOGIN_SUCCESS";
      }

      throw new Error("Unexpected login response");
    } catch (err: any) {
      api.error({
        title: "Login with Google error",
        description:
          err.response?.data?.message || err.message || "Login failed",
        duration: 2,
      });

      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.warn("Logout API failed but continuing cleanup");
    }

    setAuthorized(false);
    setUser(null);
    setIsAdmin(false);

    router.push("/login");
  };

  // Refresh auth before render
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // Handle logout
  useEffect(() => {
    const handleLogout = () => {
      setAuthorized(false);
      setUser(null);
      setIsAdmin(false);
      router.push("/login");
    };

    window.addEventListener("auth-logout", handleLogout);

    return () => {
      window.removeEventListener("auth-logout", handleLogout);
    };
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        contextHolder,
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
