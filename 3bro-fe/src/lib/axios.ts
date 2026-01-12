import axios from "axios";
// import { cookies } from "next/headers";


const api = axios.create({
    baseURL: "https://localhost:7041/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            // handle logout / refresh token
        }
        return Promise.reject(err);
    }
);
// api.interceptors.request.use((config) => {
//     const match = document.cookie.match(/access_token=([^;]+)/);
//     const token = match?.[1];

//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

export default api;

