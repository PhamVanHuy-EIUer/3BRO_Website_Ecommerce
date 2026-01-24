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

// Interceptor cho response
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;

    // Nếu không có response hoặc config
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    // Nếu request là refresh token endpoint, không retry
    if (originalRequest.url?.includes("/Auth/refresh")) {
      // Clear cookie và redirect về login
      if (typeof window !== "undefined") {
        document.cookie = "CURRENT_USER=; path=/; max-age=0";
        if (window.location.pathname !== "/login") {
          Router.push("/login");
        }
      }
      return Promise.reject(error);
    }

    // Kiểm tra xem có phải endpoint public không
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    // Nếu không phải lỗi 401, hoặc đã retry, hoặc là public endpoint
    if (
      error.response.status !== 401 ||
      originalRequest._retry ||
      isPublicEndpoint
    ) {
      return Promise.reject(error);
    }

    // Đánh dấu request đã được retry
    originalRequest._retry = true;

    // Nếu đang refresh token, thêm vào queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => axiosClient(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    // Bắt đầu quá trình refresh token
    isRefreshing = true;

    try {
      // Gọi API refresh token
      const response = await axiosClient.post("/Auth/refresh");

      // Nếu refresh thành công
      if (response.data?.isSuccess) {
        // Có thể lấy thông tin user mới nếu cần
        // const userResponse = await userService.getMyUser();
        // if (userResponse.data?.isSuccess && userResponse.data?.object) {
        //   const jsonString = JSON.stringify(userResponse.data.object);
        //   document.cookie = `CURRENT_USER=${encodeURIComponent(jsonString)}; path=/; max-age=${60 * 60}`;
        // }

        // Emit event khi token được refresh thành công
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("token-refreshed"));
        }

        // Xử lý queue
        processQueue(null, response.data.object);

        // Retry request gốc
        return axiosClient(originalRequest);
      } else {
        throw new Error("Refresh token failed");
      }
    } catch (refreshError) {
      // Xử lý lỗi refresh token
      processQueue(refreshError, null);

      // Clear cookie
      if (typeof window !== "undefined") {
        document.cookie = "CURRENT_USER=; path=/; max-age=0";

        // Redirect về login nếu chưa ở trang login
        if (window.location.pathname !== "/login") {
          Router.push("/login");
        }
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;