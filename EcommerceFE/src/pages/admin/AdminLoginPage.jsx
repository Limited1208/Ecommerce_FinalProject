import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FiShield } from "react-icons/fi";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAdminAuth, isAdminAuthenticated } from "../../hooks/useAdminAuth";
import { gradients, shadows, tw } from "../../assets/theme";
import AuthLayout from "../../components/AuthLayout";
import AuthCard from "../../components/AuthCard";
import { ErrorBanner } from "../../components/AlertBanner";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminLoginPage() {
    usePageTitle("Admin Sign In");
    const { login, loading, error } = useAdminAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (isAdminAuthenticated()) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <AuthLayout>
            <AuthCard>
                <div className="flex items-center gap-2 mb-2">
                    <FiShield className="text-[#ff6b00]" size={18} />
                    <p className={`${tw.labelOrange} mb-0`}>Admin access</p>
                </div>
                <h1 className="heading text-[28px] text-white mb-2">Sign in</h1>
                <p className="text-sm text-[#664433] mb-7 leading-relaxed">
                    Manage products, orders, and store settings.
                </p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        login(email, password);
                    }}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-1.5">
                        <label className={tw.label}>Email</label>
                        <input
                            type="email"
                            autoComplete="username"
                            placeholder="admin@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={tw.input}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={tw.label}>Password</label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={tw.input}
                            required
                        />
                    </div>

                    <ErrorBanner message={error} />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`${tw.btnPrimary} mt-1 w-full py-3.5 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed`}
                        style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}
                    >
                        {loading ? (
                            <>
                                <LoadingSpinner /> Signing in…
                            </>
                        ) : (
                            "Enter console"
                        )}
                    </button>
                </form>

                {import.meta.env.DEV && (
                    <p className="text-[10px] text-[#2a1500] text-center mt-6 leading-relaxed">
                        Dev demo (if API unavailable):{" "}
                        <span className="text-[#664433]">admin@strikzon.com</span> /{" "}
                        <span className="text-[#664433]">Admin123!</span>
                    </p>
                )}
            </AuthCard>

            <p className="text-center text-[12px] text-[#664433] mt-4">
                Customer account?{" "}
                <Link
                    to="/login"
                    className="text-[#ff6b00] font-semibold no-underline border-b border-[#ff6b0066] pb-px hover:text-white hover:border-white transition-colors"
                >
                    Store sign in
                </Link>
            </p>
        </AuthLayout>
    );
}
