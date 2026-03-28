import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft, FiCheck } from "react-icons/fi";
import { usePageTitle } from "../hooks/usePageTitle";
import { forgotPasswordApi } from "../api/authApi";
import { gradients, shadows, tw } from "../assets/theme";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import { ErrorBanner } from "../components/AlertBanner";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ForgotPasswordPage() {
    usePageTitle("Forgot Password");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
        setLoading(true); setError("");
        try {
            await forgotPasswordApi(email);
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.message ?? err.response?.data?.error ?? "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthCard>

                {/* ── Success state ── */}
                {sent && (
                    <div className="flex flex-col items-center text-center gap-5 py-4">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}>
                            <FiCheck size={28} className="text-white" />
                        </div>
                        <div>
                            <p className={`${tw.labelOrange} mb-2`}>Check your inbox</p>
                            <h1 className="heading text-[28px] text-white mb-3">Email Sent!</h1>
                            <p className="text-sm text-[#aa8866] leading-relaxed">
                                We sent a reset link to <span className="text-white font-semibold">{email}</span>.
                            </p>
                        </div>
                        <p className="text-xs text-[#664433]">
                            Didn't receive it?{" "}
                            <button onClick={() => { setSent(false); setError(""); }}
                                className="text-[#ff6b00] underline bg-transparent border-none cursor-pointer hover:text-white transition-colors">
                                Try again
                            </button>
                        </p>
                        <Link to="/login"
                            className={`${tw.btnPrimary} w-full py-3.5 flex items-center justify-center gap-2 no-underline`}
                            style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}>
                            <FiArrowLeft size={13} /> Back to Sign In
                        </Link>
                    </div>
                )}

                {/* ── Form state ── */}
                {!sent && (
                    <>
                        <p className={`${tw.labelOrange} mb-2`}>Account recovery</p>
                        <h1 className="heading text-[32px] text-white mb-2">Forgot Password?</h1>
                        <p className="text-sm text-[#664433] mb-7 leading-relaxed">
                            Enter your email and we'll send you a reset link.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className={tw.label}>Email Address</label>
                                <div className="relative flex items-center">
                                    <FiMail size={14} className="absolute left-3.5 text-[#664433]" />
                                    <input type="email" placeholder="your@email.com" value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                        className={`${tw.input} pl-9`} required autoFocus />
                                </div>
                            </div>

                            <ErrorBanner message={error} />

                            <button type="submit" disabled={loading}
                                className={`${tw.btnPrimary} mt-1 w-full py-3.5 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed`}
                                style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}
                            >
                                {loading ? <><LoadingSpinner /> Sending…</> : <><FiMail size={13} /> Send Reset Link</>}
                            </button>
                        </form>

                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-[#1e1000]" />
                            <span className="text-[10px] text-[#2a1500] tracking-[0.15em] uppercase">or</span>
                            <div className="flex-1 h-px bg-[#1e1000]" />
                        </div>

                        <p className="text-center text-[13px] text-[#664433]">
                            Remember your password?{" "}
                            <Link to="/login" className="text-[#ff6b00] font-semibold no-underline border-b border-[#ff6b0066] pb-px hover:text-white hover:border-white transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </>
                )}

            </AuthCard>
        </AuthLayout>
    );
}