import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi } from "../api/authApi";

export function useAuth() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const login = async (email, password) => {
        setLoading(true);
        setError("");
        try {
            const data = await loginApi(email, password);

            // Save token + user info — adjust field names to match your API response
            localStorage.setItem("token", data.token ?? data.accessToken ?? "");
            localStorage.setItem("user", JSON.stringify(data.user ?? { email }));

            navigate("/");
        } catch (err) {
            const msg =
                err.response?.data?.message ??
                err.response?.data?.error ??
                "Invalid email or password.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
}

export function useRegister() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const register = async ({ email, password, firstName, lastName }) => {
        setLoading(true);
        setError("");
        try {
            const data = await registerApi(email, password, firstName, lastName);

            // Save token + user info — adjust field names to match your API response
            localStorage.setItem("token", data.token ?? data.accessToken ?? "");
            localStorage.setItem("user", JSON.stringify(data.user ?? { email }));

            navigate("/");
        }
        catch (err) {
            const msg =
                err.response?.data?.message ??
                err.response?.data?.error ??
                "Registration failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return { register, loading, error };
}
