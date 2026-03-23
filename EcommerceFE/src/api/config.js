import axios from "axios";

const baseUrl = axios.create({
    baseURL: "http://localhost:8080/api/",
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
            if (!window.location.pathname.includes("/login")) {
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