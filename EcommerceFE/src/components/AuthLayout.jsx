import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { keyframes } from "../assets/theme";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#0d0800] flex flex-col items-center justify-center px-6 py-8">
            <style>{keyframes}</style>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 mb-9 no-underline">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="url(#fireGradAuth)">
                    <defs>
                        <linearGradient id="fireGradAuth" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ff6b00" />
                            <stop offset="100%" stopColor="#ff0040" />
                        </linearGradient>
                    </defs>
                    <path d="M13 2L4.09 12.97H11L10 22l9.91-10.97H14L13 2z" />
                </svg>
                <span className="heading text-[22px] text-white tracking-[0.2em]">STRIKEZON</span>
            </Link>

            {/* Content */}
            {children}

            {/* Back to store */}
            <Link
                to="/"
                className="mt-7 flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#2a1500] no-underline hover:text-[#ff6b00] transition-colors"
            >
                <FiArrowLeft size={11} /> Back to store
            </Link>
        </div>
    );
}