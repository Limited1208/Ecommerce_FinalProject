import axios from "axios";

/** Same origin as `config.js`; uses `adminToken` only (keeps shop `token` separate). */
const adminClient = axios.create({
    baseURL: "http://localhost:8080/api/",
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

adminClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

adminClient.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status;
        if (status === 401) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
            const path = window.location.pathname;
            if (!path.includes("/admin/login")) {
                window.location.href = "/admin/login";
            }
        }
        return Promise.reject(err);
    }
);

export default adminClient;
