import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useRegister } from "../hooks/useAuth";
import { gradients, shadows, tw } from "../assets/theme";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import PasswordInput from "../components/PasswordInput";
import PasswordStrength from "../components/PasswordStrength";
import { ErrorBanner } from "../components/AlertBanner";
import LoadingSpinner from "../components/LoadingSpinner";

export default function RegisterPage() {
  usePageTitle("Create Account");
  const { register, loading, error } = useRegister();

  const [firstName, setFirstName]             = useState("");
  const [lastName, setLastName]               = useState("");
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed]                   = useState(false);
  const [localError, setLocalError]           = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");
    if (password.length < 8)          { setLocalError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setLocalError("Passwords do not match."); return; }
    if (!agreed)                      { setLocalError("You must agree to the Terms & Conditions."); return; }
    register({ firstName, lastName, email, password });
  };

  return (
    <AuthLayout>
      <AuthCard wide>
        <p className={`${tw.labelOrange} mb-2`}>Join STRIKEZON</p>
        <h1 className="heading text-[32px] text-white mb-7">Create Account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={tw.label}>First Name</label>
              <input type="text" placeholder="John" value={firstName}
                onChange={(e) => setFirstName(e.target.value)} className={tw.input} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={tw.label}>Last Name</label>
              <input type="text" placeholder="Doe" value={lastName}
                onChange={(e) => setLastName(e.target.value)} className={tw.input} required />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={tw.label}>Email</label>
            <input type="email" placeholder="your@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)} className={tw.input} required />
          </div>

          <PasswordInput label="Password" placeholder="Min. 8 characters"
            value={password} onChange={(e) => setPassword(e.target.value)} />
          <PasswordStrength password={password} />

          <PasswordInput label="Confirm Password" placeholder="Repeat your password"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {confirmPassword.length > 0 && (
            <p className={`text-[11px] -mt-1 ${confirmPassword === password ? "text-green-400" : "text-[#ff0040]"}`}>
              {confirmPassword === password ? "✓ Passwords match" : "✗ Passwords do not match"}
            </p>
          )}

          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#664433] leading-relaxed">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 flex-shrink-0 accent-[#ff6b00]" />
            <span>
              I agree to the{" "}
              <span className="text-[#ff6b00] border-b border-[#ff6b0066] hover:text-white transition-colors cursor-pointer">Terms &amp; Conditions</span>
              {" "}and{" "}
              <span className="text-[#ff6b00] border-b border-[#ff6b0066] hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            </span>
          </label>

          <ErrorBanner message={localError || error} />

          <button type="submit" disabled={loading}
            className={`${tw.btnPrimary} mt-1 w-full py-3.5 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed`}
            style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}
          >
            {loading ? <><LoadingSpinner /> Creating account…</> : "Create Account"}
          </button>
        </form>

        <p className="text-center text-[13px] text-[#664433] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#ff6b00] font-semibold no-underline border-b border-[#ff6b0066] pb-px hover:text-white hover:border-white transition-colors">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}