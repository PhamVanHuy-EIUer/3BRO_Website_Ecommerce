import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
    baseURL: "https://localhost:7041/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

/**
 * Request interceptor
 * Tự động gắn Bearer token
 */
axiosClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get("access_token");

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * Bắt lỗi 401 / 403
 */
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // TODO: refresh token hoặc logout
            Cookies.remove("access_token");
            // window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
