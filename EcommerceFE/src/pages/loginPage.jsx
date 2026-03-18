import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../hooks/useAuth";
import { gradients, shadows, keyframes, tw } from "../assets/theme";

export default function LoginPage() {
    usePageTitle("Sign In");

    const { login, loading, error } = useAuth();

    const [email, setEmail]             = useState("");
    const [password, setPassword]       = useState("");
    const [showPassword, setShowPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div className="min-h-screen bg-[#0d0800] flex flex-col items-center justify-center px-6 py-8">
            <style>{keyframes}</style>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 mb-9 no-underline">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="url(#fireGradLogin)">
                    <defs>
                        <linearGradient id="fireGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ff6b00" />
                            <stop offset="100%" stopColor="#ff0040" />
                        </linearGradient>
                    </defs>
                    <path d="M13 2L4.09 12.97H11L10 22l9.91-10.97H14L13 2z" />
                </svg>
                <span className="heading text-[22px] text-white tracking-[0.2em]">STRIKEZON</span>
            </Link>

            {/* Card */}
            <div
                className={`${tw.card} animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)_both] w-full max-w-[420px] p-10`}
                style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,0,0.05)" }}
            >
                <p className={`${tw.labelOrange} mb-2`}>Welcome back</p>
                <h1 className="heading text-[32px] text-white mb-7">Sign In</h1>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className={tw.label}>Email</label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={tw.input}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <label className={tw.label}>Password</label>
                            <button
                                type="button"
                                className="text-[11px] text-[#ff6b00] bg-transparent border-none cursor-pointer tracking-wide hover:opacity-70 transition-opacity"
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`${tw.input} pr-10`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-[#664433] hover:text-[#ff6b00] transition-colors bg-transparent border-none cursor-pointer p-0"
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

                    {/* API Error */}
                    {error && (
                        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#1a0005] border border-[#ff004033]">
                            <span className="text-[#ff0040] text-lg leading-none">⚠</span>
                            <p className="text-xs text-[#ff0040]">{error}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`${tw.btnPrimary} mt-1 w-full py-3.5 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100`}
                        style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-[spin_0.7s_linear_infinite]" />
                                Signing in…
                            </>
                        ) : "Sign In"}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                    <div className={`${tw.dividerFull} flex-1`} />
                    <span className="text-[10px] text-[#2a1500] tracking-[0.15em] uppercase">or</span>
                    <div className={`${tw.dividerFull} flex-1`} />
                </div>

                {/* Register link */}
                <p className="text-center text-[13px] text-[#664433]">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-[#ff6b00] font-semibold no-underline border-b border-[#ff6b0066] pb-px hover:text-white hover:border-white transition-colors"
                    >
                        Create account
                    </Link>
                </p>
            </div>

            {/* Back to store */}
            <Link
                to="/"
                className="mt-7 flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#2a1500] no-underline hover:text-[#ff6b00] transition-colors"
            >
                ← Back to store
            </Link>
        </div>
    );
}