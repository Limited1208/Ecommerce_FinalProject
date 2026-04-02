import axios from "axios";

export const API_URL = import.meta.env.VITE_API_BASE_URL;

const baseUrl = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// const baseUrl = axios.create({
//   baseURL: "http://172.20.10.2:8080/api/",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 10000,
// });

baseUrl.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

baseUrl.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status;

        if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            const path = window.location.pathname;
            if (path.includes("/login") || path.includes("/register")) {
                return Promise.reject(err);
            }
            if (path.startsWith("/admin")) {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminUser");
                window.location.href = "/admin/login";
            } else {
                window.location.href = "/login";
            }
        }

        if (status === 403) {
            console.warn("Access denied: insufficient permissions.");
        }

        if (status === 500) {
            console.error("Internal server error. Please try again later.");
        }

        if (err.code === "ECONNABORTED") {
            console.error("Request timed out. Please check your connection.");
        }

        if (!err.response) {
            console.error("Network error. Please check your connection.");
        }

        return Promise.reject(err);
    }
);

export default baseUrl;