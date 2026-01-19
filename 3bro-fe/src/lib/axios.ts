// import axios, {
//   AxiosInstance,
//   InternalAxiosRequestConfig,
// } from "axios";

// const axiosClient: AxiosInstance = axios.create({
//   baseURL: "https://localhost:7041/api",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// interface RetryConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }

// let isRefreshing = false;
// let failedQueue: {
//   resolve: (value?: unknown) => void;
//   reject: (reason?: any) => void;
// }[] = [];

// const processQueue = (error?: any) => {
//   failedQueue.forEach(p => {
//     if (error) p.reject(error);
//     else p.resolve();
//   });
//   failedQueue = [];
// };

// const PUBLIC_ENDPOINTS = [
//   "/Auth/login",
//   "/Auth/register",
//   "/Auth/refresh",
//   "/Auth/login-google",
// ];

// axiosClient.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config as RetryConfig;

//     if (!error.response) {
//       return Promise.reject(error);
//     }

//     if (
//       error.response.status !== 401 ||
//       originalRequest._retry ||
//       PUBLIC_ENDPOINTS.some(p =>
//         originalRequest.url?.includes(p)
//       )
//     ) {
//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;

//     if (isRefreshing) {
//       return new Promise((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       }).then(() => axiosClient(originalRequest));
//     }

//     isRefreshing = true;

//     try {
//       await axiosClient.post("/Auth/refresh");
//       processQueue();

//       // THÊM: Emit event khi token được refresh thành công
//       if (typeof window !== "undefined") {
//         window.dispatchEvent(new CustomEvent("token-refreshed"));
//       }

//       return axiosClient(originalRequest);
//     } catch (refreshError) {
//       processQueue(refreshError);

//       // if (
//       //   typeof window !== "undefined" &&
//       //   window.location.pathname !== "/login"
//       // ) {
//       //   window.location.href = "/login";
//       // }

//       return Promise.reject(refreshError);
//     } finally {
//       isRefreshing = false;
//     }
//   }
// );

// export default axiosClient;

import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "https://localhost:7041/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 30000,
});

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error?: AxiosError | null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

const PUBLIC_ENDPOINTS = [
  "/Auth/login",
  "/Auth/register",
  "/Auth/refresh",
  "/Auth/login-google",
  "/Auth/forgot-password",
  "/Auth/reset-password",
] as const;

const isPublicEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

const MAX_RETRY_COUNT = 1;

// Response interceptor
axiosClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;

    // Nếu không có response hoặc config, reject ngay
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const { status } = error.response;

    // Chỉ xử lý 401 Unauthorized
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Không retry nếu:

    if (
      originalRequest._retry ||
      isPublicEndpoint(originalRequest.url) ||
      (originalRequest._retryCount ?? 0) >= MAX_RETRY_COUNT
    ) {
      // Nếu refresh token failed, redirect về login
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        // Dispatch event trước khi redirect
        window.dispatchEvent(
          new CustomEvent("auth-error", {
            detail: { status, message: "Session expired" },
          })
        );

        // Delay nhỏ để các component có thể cleanup
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }

      return Promise.reject(error);
    }

    // Đánh dấu đã retry
    originalRequest._retry = true;
    originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;

    // Nếu đang refresh, đưa vào queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => axiosClient(originalRequest))
        .catch(err => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // Gọi API refresh token
      await axiosClient.post("/Auth/refresh");

      // Xử lý queue thành công
      processQueue(null);

      // Emit event khi refresh thành công
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("token-refreshed", {
            detail: { timestamp: new Date().toISOString() },
          })
        );
      }

      // Retry request gốc
      return axiosClient(originalRequest);
    } catch (refreshError) {
      // Xử lý queue thất bại
      processQueue(refreshError as AxiosError);

      // Redirect về login
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.dispatchEvent(
          new CustomEvent("auth-error", {
            detail: {
              status: 401,
              message: "Token refresh failed",
            },
          })
        );

        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);


export default axiosClient;