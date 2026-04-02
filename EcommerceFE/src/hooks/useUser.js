import { useState, useEffect, useCallback } from "react";
import { data, useNavigate } from "react-router-dom";
import { logoutApi } from "../api/authApi";
import { getProfileApi, updateProfileApi, changePasswordApi } from "../api/userApi";

/* ── Module-level helpers (hoisted, no re-creation on render) ── */
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isLoggedIn = !!user && !!localStorage.getItem("token");

    /* ── Fetch fresh profile from backend ── */
    const refreshProfile = useCallback(async () => {
        if (!localStorage.getItem("token")) return;
        setLoading(true);
        setError(null);
        try {
            const fresh = await getProfileApi();            // GET /user/me
            setUser(fresh);
            localStorage.setItem("user", JSON.stringify(fresh));
        } catch (err) {
            setError(err.response?.data?.message ?? "Failed to load profile.");
        } finally {
            setLoading(false);
        }
    }, []);

    /* ── Fetch on mount if logged in ── */
    useEffect(() => {
        if (isLoggedIn) refreshProfile();
    }, []);

    /* ── Re-sync when storage changes (other tabs) ── */
    useEffect(() => {
        const handler = () => setUser(getUser());
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    /* ── Update profile: PATCH /user/me + sync local state ── */
    const updateProfile = useCallback(async (data) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await updateProfileApi(data);   // PATCH /user/me
            setUser(updated);
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
        } catch (err) {
            const msg = err.response?.data?.message ?? "Failed to update profile.";
            setError(msg);
            throw err;                                       
        } finally {
            setLoading(false);
        }
    }, []);

    const changePassword = useCallback(async (currentPassword, newPassword) => {
        setLoading(true);
        setError(null);
        try{
            const updated = await changePasswordApi(currentPassword, newPassword);
            return updated;
        }catch(err){
            const msg = err.response?.data?.message ?? "Fail to change password"
            setError(msg)
            throw err;
        }finally{
            setLoading(false)
        }
    })

    /* ── Logout: DELETE refreshToken in DB + clear session ── */
    const logout = useCallback(async () => {
        try {
            await logoutApi(); // JWT token carries userId — backend reads it via @GetUser()
        } catch {
            // silently ignore — always clear local session
        } finally {
            clearSession();
            setUser(null);
            navigate("/login");
        }
    }, [user?.id, navigate]);

    return {
        user,
        isLoggedIn,
        loading,
        error,
        logout,
        refreshProfile,
        changePassword,   
        updateProfile,   
    };
}