import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useRegister } from "../hooks/useAuth";
import { gradients, shadows, keyframes, tw } from "../assets/theme";

/* ── Reusable password input ── */
function PasswordInput({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${tw.input} pr-10`}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-[#664433] hover:text-[#ff6b00] transition-colors bg-transparent border-none cursor-pointer p-0"
      >
        {show ? (
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        ) : (
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )}
      </button>
    </div>
  );
}

/* ── Main page ── */
export default function RegisterPage() {
  usePageTitle("Create Account");

  const { register, loading, error } = useRegister();

  const [firstName, setFirstName]       = useState("");
  const [lastName, setLastName]         = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed]             = useState(false);
  const [localError, setLocalError]     = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    console.log("Registering with", { firstName, lastName, email, password, confirmPassword, agreed });

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setLocalError("You must agree to the Terms & Conditions.");
      return;
    }

    register({email, password, firstName, lastName});
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-[#0d0800] flex flex-col items-center justify-center px-6 py-8">
      <style>{keyframes}</style>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 mb-9 no-underline">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="url(#fireGradReg)">
          <defs>
            <linearGradient id="fireGradReg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b00"/>
              <stop offset="100%" stopColor="#ff0040"/>
            </linearGradient>
          </defs>
          <path d="M13 2L4.09 12.97H11L10 22l9.91-10.97H14L13 2z"/>
        </svg>
        <span className="heading text-[22px] text-white tracking-[0.2em]">STRIKEZON</span>
      </Link>

      {/* Card */}
      <div
        className={`${tw.card} animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)_both] w-full max-w-[440px] p-10`}
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,0,0.05)" }}
      >
        <p className={`${tw.labelOrange} mb-2`}>Join STRIKEZON</p>
        <h1 className="heading text-[32px] text-white mb-7">Create Account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Full name */}
          <div className="flex flex-col gap-1.5">
            <label className={tw.label}>First Name</label>
            <input
              type="text"
              placeholder="Your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={tw.input}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={tw.label}>Last Name</label>
            <input
              type="text"
              placeholder="Your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={tw.input}
              required
            />
          </div>

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
            <label className={tw.label}>Password</label>
            <PasswordInput
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label className={tw.label}>Confirm Password</label>
            <PasswordInput
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#664433] leading-relaxed">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 flex-shrink-0 accent-[#ff6b00]"
            />
            <span>
              I agree to the{" "}
              <span className="text-[#ff6b00] border-b border-[#ff6b0066] cursor-pointer hover:text-white hover:border-white transition-colors">
                Terms &amp; Conditions
              </span>
              {" "}and{" "}
              <span className="text-[#ff6b00] border-b border-[#ff6b0066] cursor-pointer hover:text-white hover:border-white transition-colors">
                Privacy Policy
              </span>
            </span>
          </label>

          {/* Error banner */}
          {displayError && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#1a0005] border border-[#ff004033]">
              <span className="text-[#ff0040] text-lg leading-none">⚠</span>
              <p className="text-xs text-[#ff0040]">{displayError}</p>
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
                Creating account…
              </>
            ) : "Create Account"}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-[13px] text-[#664433] mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#ff6b00] font-semibold no-underline border-b border-[#ff6b0066] pb-px hover:text-white hover:border-white transition-colors"
          >
            Sign in
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