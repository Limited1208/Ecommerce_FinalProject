import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../hooks/useAuth";
import { gradients, shadows, tw } from "../assets/theme";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import PasswordInput from "../components/PasswordInput";
import { ErrorBanner } from "../components/AlertBanner";
import LoadingSpinner from "../components/LoadingSpinner";

export default function LoginPage() {
    usePageTitle("Sign In");
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <AuthLayout>
            <AuthCard>
                <p className={`${tw.labelOrange} mb-2`}>Welcome back</p>
                <h1 className="heading text-[32px] text-white mb-7">Sign In</h1>

                <form onSubmit={(e) => { e.preventDefault(); login(email, password); }} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className={tw.label}>Email</label>
                        <input type="email" placeholder="your@email.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} className={tw.input} required />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <label className={tw.label}>Password</label>
                            <Link to="/forgot-password" className="text-[11px] text-[#ff6b00] no-underline hover:opacity-70 transition-opacity">
                                Forgot password?
                            </Link>
                        </div>
                        <PasswordInput placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <ErrorBanner message={error} />

                    <button type="submit" disabled={loading}
                        className={`${tw.btnPrimary} mt-1 w-full py-3.5 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed`}
                        style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}
                    >
                        {loading ? <><LoadingSpinner /> Signing in…</> : "Sign In"}
                    </button>
                </form>

                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-[#1e1000]" />
                    <span className="text-[10px] text-[#2a1500] tracking-[0.15em] uppercase">or</span>
                    <div className="flex-1 h-px bg-[#1e1000]" />
                </div>

                <p className="text-center text-[13px] text-[#664433]">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="text-[#ff6b00] font-semibold no-underline border-b border-[#ff6b0066] pb-px hover:text-white hover:border-white transition-colors">
                        Create account
                    </Link>
                </p>
            </AuthCard>
        </AuthLayout>
    );
}