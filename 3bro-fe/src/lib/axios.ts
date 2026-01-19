import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "https://localhost:7041/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error?: any) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve();
  });
  failedQueue = [];
};

const PUBLIC_ENDPOINTS = [
  "/Auth/login",
  "/Auth/register",
  "/Auth/refresh",
  "/Auth/login-google",
];

axiosClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config as RetryConfig;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (
      error.response.status !== 401 ||
      originalRequest._retry ||
      PUBLIC_ENDPOINTS.some(p =>
        originalRequest.url?.includes(p)
      )
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => axiosClient(originalRequest));
    }

    isRefreshing = true;

    try {
      await axiosClient.post("/Auth/refresh");
      processQueue();

      // ✅ THÊM: Emit event khi token được refresh thành công
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("token-refreshed"));
      }

      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      // if (
      //   typeof window !== "undefined" &&
      //   window.location.pathname !== "/login"
      // ) {
      //   window.location.href = "/login";
      // }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;