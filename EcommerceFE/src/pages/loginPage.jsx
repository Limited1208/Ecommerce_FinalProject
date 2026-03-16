import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export default function LoginPage() {
    usePageTitle("Sign In")
    const [showPassword, setShowPassword] = useState(false);

    const inputStyle = {
        width: "100%",
        padding: "11px 14px",
        border: "1px solid #2a1500",
        borderRadius: "8px",
        fontSize: "14px",
        color: "#fff",
        background: "#110700",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#0d0800",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
        }}>
            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        ::placeholder { color: #2a1500; }
      `}</style>

            {/* Logo */}
            <Link to="/" style={{
                display: "flex", alignItems: "center", gap: "10px",
                marginBottom: "36px", textDecoration: "none",
            }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="url(#fireGradLogin)">
                    <defs>
                        <linearGradient id="fireGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ff6b00" />
                            <stop offset="100%" stopColor="#ff0040" />
                        </linearGradient>
                    </defs>
                    <path d="M13 2L4.09 12.97H11L10 22l9.91-10.97H14L13 2z" />
                </svg>
                <span className="heading" style={{ fontSize: "22px", color: "#fff", letterSpacing: "0.2em" }}>
                    STRIKEZON
                </span>
            </Link>

            {/* Card */}
            <div className="login-card" style={{
                background: "#130900",
                border: "1px solid #2a1500",
                borderRadius: "20px",
                padding: "40px",
                width: "100%",
                maxWidth: "420px",
                boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,0,0.05)",
            }}>
                {/* Heading */}
                <p style={{
                    fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase",
                    color: "#ff6b00", marginBottom: "8px",
                }}>
                    Welcome back
                </p>
                <h1 className="heading" style={{ fontSize: "32px", color: "#fff", marginBottom: "28px" }}>
                    Sign In
                </h1>

                {/* Form */}
                <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

                    {/* Email */}
                    <div>
                        <label style={{
                            display: "block", fontSize: "10px", letterSpacing: "0.2em",
                            textTransform: "uppercase", color: "#664433", marginBottom: "6px",
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = "#ff6b00"}
                            onBlur={(e) => e.target.style.borderColor = "#2a1500"}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <label style={{
                                fontSize: "10px", letterSpacing: "0.2em",
                                textTransform: "uppercase", color: "#664433",
                            }}>
                                Password
                            </label>
                            <button type="button" style={{
                                background: "none", border: "none",
                                fontSize: "11px", color: "#ff6b00",
                                cursor: "pointer", padding: 0, letterSpacing: "0.5px",
                            }}>
                                Forgot password?
                            </button>
                        </div>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                style={{ ...inputStyle, padding: "11px 40px 11px 14px" }}
                                onFocus={(e) => e.target.style.borderColor = "#ff6b00"}
                                onBlur={(e) => e.target.style.borderColor = "#2a1500"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                style={{
                                    position: "absolute", right: "12px", top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none", border: "none",
                                    cursor: "pointer", color: "#664433",
                                    padding: 0, display: "flex", alignItems: "center",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#ff6b00"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "#664433"}
                            >
                                {showPassword ? (
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        style={{
                            marginTop: "4px", padding: "13px",
                            background: "linear-gradient(135deg, #ff6b00, #ff0040)",
                            color: "#fff", border: "none", borderRadius: "8px",
                            fontSize: "11px", letterSpacing: "0.2em",
                            textTransform: "uppercase", fontWeight: 700,
                            cursor: "pointer",
                            boxShadow: "0 8px 24px rgba(255,107,0,0.3)",
                            transition: "transform 0.15s, box-shadow 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(255,107,0,0.45)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,107,0,0.3)"; }}
                    >
                        Sign In
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
                    <div style={{ flex: 1, height: "1px", background: "#1e1000" }} />
                    <span style={{ fontSize: "10px", color: "#2a1500", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                        or
                    </span>
                    <div style={{ flex: 1, height: "1px", background: "#1e1000" }} />
                </div>

                {/* Register link */}
                <p style={{ textAlign: "center", fontSize: "13px", color: "#664433" }}>
                    Don&apos;t have an account?{" "}
                    <Link to="/register" style={{
                        color: "#ff6b00", fontWeight: 600,
                        textDecoration: "none",
                        borderBottom: "1px solid #ff6b0066",
                        paddingBottom: "1px",
                        transition: "color 0.2s, border-color 0.2s",
                    }}>
                        Create account
                    </Link>
                </p>
            </div>

            {/* Back to store */}
            <Link to="/" style={{
                marginTop: "28px", fontSize: "10px",
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "#2a1500", textDecoration: "none",
                display: "flex", alignItems: "center", gap: "6px",
                transition: "color 0.2s",
            }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#ff6b00"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#2a1500"}
            >
                ← Back to store
            </Link>
        </div>
    );
}