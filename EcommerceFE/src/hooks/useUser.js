import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutApi } from "../api/authApi";

function getUser() {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export function useUser() {
    const navigate = useNavigate();
    const [user, setUser] = useState(getUser); 

    useEffect(() => {
        const handler = () => setUser(getUser());
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    const isLoggedIn = !!user && !!localStorage.getItem("token");

    const logout = async () => {
        try {
            const userId = user?.id;
            if (userId) await logoutApi(userId);
        } catch {
            // silently ignore — still clear session even if API fails
        } finally {
            clearSession();
            setUser(null);
            navigate("/login");
        }
    };

    return { user, isLoggedIn, logout };
}