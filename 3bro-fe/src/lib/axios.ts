import Router from "next/router";
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

// Định nghĩa kiểu cho queue
interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}

// Định nghĩa kiểu cho retry config
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Tạo axios instance
const axiosClient: AxiosInstance = axios.create({
  baseURL: "https://localhost:7041/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Biến quản lý refresh token
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

// Xử lý queue các request bị fail
const processQueue = (error: any = null, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Danh sách các endpoint public không cần xử lý refresh token
const PUBLIC_ENDPOINTS = [
  "/Auth/login",
  "/Auth/register",
  "/Auth/refresh",
  "/Auth/login-google",
  "/Auth/forgot-password",
  "/Auth/reset-password",

  "/Product",
  "/Category",
  "/Banner",
];


// Interceptor cho request (có thể thêm token vào header nếu cần)
axiosClient.interceptors.request.use(
  (config) => {
    // Có thể thêm logic thêm token vào header ở đây nếu cần
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    // ❌ Không retry refresh endpoint
    if (originalRequest.url?.includes("/Auth/refresh")) {
      return Promise.reject(error);
    }

    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    // ❌ Không refresh cho public API hoặc không phải 401
    if (
      error.response.status !== 401 ||
      originalRequest._retry ||
      isPublicEndpoint
    ) {
      return Promise.reject(error);
    }

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
        return axiosClient(originalRequest);
      }

      throw new Error("Refresh token failed");
    } catch (refreshError) {
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);


export default axiosClient;