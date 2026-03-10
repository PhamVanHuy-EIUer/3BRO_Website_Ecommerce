import Router from "next/router";
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosClient: AxiosInstance = axios.create({
  baseURL: "https://localhost:7041/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];
let silentRefreshTimer: ReturnType<typeof setTimeout> | null = null;

const processQueue = (error: any = null, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Gọi hàm này sau khi login thành công
export const startSilentRefresh = () => {
  // Clear timer cũ nếu có
  if (silentRefreshTimer) clearTimeout(silentRefreshTimer);

  // Sau 14 phút thì refresh (token hết hạn sau 15p)
  silentRefreshTimer = setTimeout(async () => {
    try {
      const response = await axiosClient.post("/Auth/refresh");
      if (response.data?.isSuccess) {
        console.log("Silent refresh thành công");
        startSilentRefresh(); // Đặt lại timer cho lần tiếp theo
      } else {
        Router.replace("/login");
      }
    } catch {
      Router.replace("/login");
    }
  }, 14 * 60 * 1000); // 14 phút
};

export const stopSilentRefresh = () => {
  if (silentRefreshTimer) {
    clearTimeout(silentRefreshTimer);
    silentRefreshTimer = null;
  }
};

axiosClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;

    if (!error.response || !originalRequest) return Promise.reject(error);
    if (originalRequest.url?.includes("/Auth/refresh")) return Promise.reject(error);
    if (error.response.status !== 401 || originalRequest._retry) return Promise.reject(error);

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => axiosClient(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const response = await axiosClient.post("/Auth/refresh");
      if (response.data?.isSuccess) {
        processQueue(null, null);
        startSilentRefresh(); // Reset timer sau khi refresh thành công
        return axiosClient(originalRequest);
      }
      throw new Error("Refresh token failed");
    } catch (refreshError) {
      processQueue(refreshError, null);
      stopSilentRefresh();
      Router.replace("/login");
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;