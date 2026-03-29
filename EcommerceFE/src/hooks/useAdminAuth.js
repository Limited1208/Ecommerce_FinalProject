import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLoginApi } from "../api/adminApi";

const ADMIN_TOKEN_KEY = "adminToken";
const ADMIN_USER_KEY = "adminUser";

/** Demo login when backend has no `/admin/login` yet (dev only). */
function tryDemoLogin(email, password) {
    if (!import.meta.env.DEV) return false;
    const ok =
        email.toLowerCase() === "admin@strikzon.com" &&
        password === "Admin123!";
    if (!ok) return false;
    localStorage.setItem(ADMIN_TOKEN_KEY, "demo-admin-token");
    localStorage.setItem(
        ADMIN_USER_KEY,
        JSON.stringify({ email, name: "Demo Admin", role: "admin" })
    );
    return true;
}

export function useAdminAuth() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const login = async (email, password) => {
        setLoading(true);
        setError("");
        try {
            const data = await adminLoginApi(email, password);
            localStorage.setItem(ADMIN_TOKEN_KEY, data.token ?? data.accessToken ?? "");
            localStorage.setItem(
                ADMIN_USER_KEY,
                JSON.stringify(data.user ?? { email, role: "admin" })
            );
            navigate("/admin", { replace: true });
        } catch (err) {
            if (tryDemoLogin(email, password)) {
                navigate("/admin", { replace: true });
                return;
            }
            const msg =
                err.response?.data?.message ??
                err.response?.data?.error ??
                (err.code === "ERR_NETWORK"
                    ? "Cannot reach server. In development, try admin@strikzon.com / Admin123!"
                    : "Invalid email or password.");
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
        navigate("/admin/login", { replace: true });
    };

    return { login, logout, loading, error };
}

export function getAdminUser() {
    try {
        const raw = localStorage.getItem(ADMIN_USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function isAdminAuthenticated() {
    return Boolean(localStorage.getItem(ADMIN_TOKEN_KEY));
}
