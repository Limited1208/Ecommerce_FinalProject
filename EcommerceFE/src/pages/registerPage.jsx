import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

/* ── Reusable password input ── */
function PasswordInput({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "11px 40px 11px 14px",
          border: "1px solid #2a1500",
          borderRadius: "8px",
          fontSize: "14px",
          color: "#fff",
          background: "#110700",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#ff6b00")}
        onBlur={(e)  => (e.target.style.borderColor = "#2a1500")}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        style={{
          position: "absolute", right: "12px", top: "50%",
          transform: "translateY(-50%)",
          background: "none", border: "none",
          cursor: "pointer", color: "#664433",
          padding: 0, display: "flex", alignItems: "center",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#ff6b00")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#664433")}
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

const labelStyle = {
  display: "block",
  fontSize: "10px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#664433",
  marginBottom: "6px",
};

export default function RegisterPage() {
  usePageTitle("Create Account")
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
        .register-card { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        ::placeholder { color: #2a1500; }
        input[type="checkbox"] { accent-color: #ff6b00; }
      `}</style>

      {/* Logo */}
      <Link to="/" style={{
        display: "flex", alignItems: "center", gap: "10px",
        marginBottom: "36px", textDecoration: "none",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="url(#fireGradReg)">
          <defs>
            <linearGradient id="fireGradReg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b00"/>
              <stop offset="100%" stopColor="#ff0040"/>
            </linearGradient>
          </defs>
          <path d="M13 2L4.09 12.97H11L10 22l9.91-10.97H14L13 2z"/>
        </svg>
        <span className="heading" style={{ fontSize: "22px", color: "#fff", letterSpacing: "0.2em" }}>
          STRIKEZON
        </span>
      </Link>

      {/* Card */}
      <div className="register-card" style={{
        background: "#130900",
        border: "1px solid #2a1500",
        borderRadius: "20px",
        padding: "40px",
        width: "100%",
        maxWidth: "440px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,0,0.05)",
      }}>
        {/* Heading */}
        <p style={{
          fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase",
          color: "#ff6b00", marginBottom: "8px",
        }}>
          Join STRIKEZON
        </p>
        <h1 className="heading" style={{ fontSize: "32px", color: "#fff", marginBottom: "28px" }}>
          Create Account
        </h1>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

          {/* Full name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#ff6b00")}
              onBlur={(e)  => (e.target.style.borderColor = "#2a1500")}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#ff6b00")}
              onBlur={(e)  => (e.target.style.borderColor = "#2a1500")}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <PasswordInput placeholder="Min. 8 characters" />
          </div>

          {/* Confirm password */}
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <PasswordInput placeholder="Repeat your password" />
          </div>

          {/* Terms */}
          <label style={{
            display: "flex", alignItems: "flex-start",
            gap: "10px", cursor: "pointer",
            fontSize: "12px", color: "#664433", lineHeight: 1.6,
          }}>
            <input type="checkbox" style={{ marginTop: "3px", flexShrink: 0 }} />
            I agree to the{" "}
            <span style={{ display: "inline" }}>
              <span style={{ color: "#ff6b00", borderBottom: "1px solid #ff6b0066", cursor: "pointer" }}>
                Terms &amp; Conditions
              </span>
              {" "}and{" "}
              <span style={{ color: "#ff6b00", borderBottom: "1px solid #ff6b0066", cursor: "pointer" }}>
                Privacy Policy
              </span>
            </span>
          </label>

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
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,107,0,0.3)"; }}
          >
            Create Account
          </button>
        </form>

        {/* Login link */}
        <p style={{ textAlign: "center", fontSize: "13px", color: "#664433", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{
            color: "#ff6b00", fontWeight: 600,
            textDecoration: "none",
            borderBottom: "1px solid #ff6b0066",
            paddingBottom: "1px",
          }}>
            Sign in
          </Link>
        </p>
      </div>

      {/* Back to store */}
      <Link
        to="/"
        style={{
          marginTop: "28px", fontSize: "10px",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "#2a1500", textDecoration: "none",
          display: "flex", alignItems: "center", gap: "6px",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#ff6b00")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#2a1500")}
      >
        ← Back to store
      </Link>
    </div>
  );
}