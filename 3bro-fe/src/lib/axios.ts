import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7041/api",
  withCredentials: true, // send cookies (important for authentication)
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor
 * Bắt lỗi 401 / 403
 */
// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // token hết hạn → logout
//     }
//     return Promise.reject(error);
//   }
// );
axiosClient.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      await axiosClient.post("/Auth/refresh");
      return axiosClient(error.config);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
