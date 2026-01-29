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

type AuthContextType = {
  authorized: boolean;
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
  contextHolder: ReactElement<unknown, string | JSXElementConstructor<any>>;
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
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

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
      console.log("Login successful, user:", user);
    } catch (error: any) {
      api.error({
        title: "Login error",
        description:
          error.response?.data?.message || "Email or password is incorrect",
      });
      throw error;
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      const res = await AuthService.loginWithGoogle(idToken);

      if (res.code === "201") {
        router.push("/setup-password");
      } else if (res.code === "200") {
        api.success({
          title: "Success",
          description: "Login successfully",
          duration: 2,
        });
        await refreshAuth();
      } else
        (err: any) => {
          api.error({
            title: "Login with Google error",
            description:
              err.response?.data?.message || err.message || "Login failed",
            duration: 2,
          });
        };
    } catch (error: any) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const res = await AuthService.logout();
      if (res.code !== "200") {
        throw new Error(res.message);
      } else if (res.code === "200") {
        api.success({
          title: "Success",
          description: "Logout successfully",
          duration: 2,
        });
        setAuthorized(false);
        setUser(null);
        await refreshAuth();

        console.log("Logout successful", res);
      }
    } catch (error: any) {
      console.error("Logout error:", error);
      api.error({
        title: "Logout error",
        description: error.message || "Logout failed",
        duration: 2,
      });
      throw error;
    }
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
