import { useState, useEffect } from "react";

export function useUser() {
    const getUser = () => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    };
    
    const [user, setUser] = useState(getUser);

    useEffect(() => {
        const handler = () => setUser(getUser());
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/login";
    };

    const isLoggedIn = !!user && !!localStorage.getItem("token");

    return { user, isLoggedIn, logout };
}