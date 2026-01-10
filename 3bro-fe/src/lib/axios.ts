import axios from "axios";


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

export default api;
