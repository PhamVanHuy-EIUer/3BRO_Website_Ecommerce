import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7041/api",
  withCredentials: true, // ⭐ RẤT QUAN TRỌNG
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor
 * Bắt lỗi 401 / 403
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token hết hạn → logout
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
