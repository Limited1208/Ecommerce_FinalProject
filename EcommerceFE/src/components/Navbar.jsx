import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";

/* ── highlight matched substring ── */
function Highlight({ text, query }) {
    if (!query) return <span>{text}</span>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
        <span>
            {text.slice(0, idx)}
            <mark className="rounded px-0.5 not-italic font-semibold" style={{ background: "#ff6b0020", color: "#ff6b00" }}>
                {text.slice(idx, idx + query.length)}
            </mark>
            {text.slice(idx + query.length)}
        </span>
    );
}

export default function Navbar({ cartCount, onCartOpen, onLogoClick, onSearch }) {
    const [expanded, setExpanded] = useState(false);
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { products } = useProducts();

    const NAV_LINKS = [
        { label: "New Drops", to: "/" },
        { label: "Running", to: "/running" },
        { label: "Apparel", to: "/apparel" },
        { label: "Sale", to: "/sale" },
    ];

    /* ── Filter suggestions ── */
    const q = query.trim().toLowerCase();
    const suggestions = q
        ? products
            .filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.variant.toLowerCase().includes(q),
            )
            .slice(0, 6)
        : [];

    const showDropdown = expanded && focused && query.trim().length > 0;

    /* ── Close when clicking outside ── */
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setFocused(false);
                setActiveIdx(-1);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const openSearch = () => { setExpanded(true); setTimeout(() => inputRef.current?.focus(), 50); };
    const closeSearch = () => { setExpanded(false); setQuery(""); setFocused(false); setActiveIdx(-1); onSearch?.(""); };
    const handleChange = (e) => { setQuery(e.target.value); setActiveIdx(-1); onSearch?.(e.target.value); };

    const selectSuggestion = (product) => {
        setQuery("");
        setFocused(false);
        navigate(`/product/${product.id}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") { closeSearch(); return; }
        if (!showDropdown) return;
        if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1)); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
        else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); selectSuggestion(suggestions[activeIdx]); }
    };

    return (
        <nav className="sticky top-0 z-30 backdrop-blur-md" style={{ background: "rgba(13,8,0,0.95)", borderBottom: "1px solid #1e1000" }}>
            <style>{`
        .search-bar {
          width: 0; opacity: 0; padding: 0;
          transition: width 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease, padding 0.3s ease;
          pointer-events: none;
        }
        .search-bar.open { width: 220px; opacity: 1; padding: 0 12px; pointer-events: all; }
        @media (max-width: 640px) { .search-bar.open { width: 130px; } }
        .dropdown-enter { animation: dropIn 0.2s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">

                {/* Logo */}
                <button onClick={onLogoClick} className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="url(#fireGradNav)">
                        <defs>
                            <linearGradient id="fireGradNav" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ff6b00" />
                                <stop offset="100%" stopColor="#ff0040" />
                            </linearGradient>
                        </defs>
                        <path d="M13 2L4.09 12.97H11L10 22l9.91-10.97H14L13 2z" />
                    </svg>
                    <span className="heading text-2xl text-white tracking-widest">STRIKEZON</span>
                </button>

                {/* Nav links */}
                <div
                    className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase"
                    style={{
                        opacity: expanded ? 0.3 : 1,
                        transition: "opacity 0.2s ease",
                        pointerEvents: expanded ? "none" : "auto",
                    }}
                >
                    {NAV_LINKS.map(({ label, to }) => {
                        const isActive = pathname === to;
                        const isSale = label === "Sale";
                        return (
                            <Link
                                key={label}
                                to={to}
                                className="transition-colors font-semibold"
                                style={{
                                    color: isSale ? "#ff0040" : isActive ? "#ff6b00" : "#664433",
                                    borderBottom: isActive ? `1px solid ${isSale ? "#ff0040" : "#ff6b00"}` : "1px solid transparent",
                                    paddingBottom: 2,
                                }}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">

                    {/* Search wrapper */}
                    <div className="relative" ref={wrapperRef}>
                        <div
                            className="flex items-center rounded-lg transition-all"
                            style={{
                                border: expanded ? "1px solid #ff6b0044" : "1px solid transparent",
                                background: expanded ? "#150900" : "transparent",
                                transition: "border-color 0.3s, background 0.3s",
                            }}
                        >
                            <button
                                onClick={expanded ? closeSearch : openSearch}
                                className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-colors"
                                style={{ color: expanded ? "#ff6b00" : "#664433" }}
                                aria-label={expanded ? "Close search" : "Open search"}
                            >
                                {expanded ? (
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                    </svg>
                                )}
                            </button>

                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setFocused(true)}
                                placeholder="Search gear…"
                                className={`search-bar ${expanded ? "open" : ""} bg-transparent text-sm text-white focus:outline-none`}
                                style={{ caretColor: "#ff6b00" }}
                                autoComplete="off"
                            />
                        </div>

                        {/* Dropdown */}
                        {showDropdown && (
                            <div
                                className="dropdown-enter absolute right-0 top-[calc(100%+10px)] w-80 rounded-xl overflow-hidden z-50"
                                style={{ background: "#150900", border: "1px solid #2a1500", boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 32px rgba(255,107,0,0.08)" }}
                            >
                                {suggestions.length > 0 ? (
                                    <>
                                        <div className="px-4 pt-3 pb-1.5">
                                            <p className="text-[10px] tracking-widest uppercase" style={{ color: "#664433" }}>
                                                {suggestions.length} result{suggestions.length !== 1 ? "s" : ""}
                                            </p>
                                        </div>

                                        <ul>
                                            {suggestions.map((product, i) => (
                                                <li key={product.id}>
                                                    <button
                                                        onMouseDown={() => selectSuggestion(product)}
                                                        onMouseEnter={() => setActiveIdx(i)}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                                                        style={{ background: activeIdx === i ? "#1e1000" : "transparent" }}
                                                    >
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                                                            style={{ border: "1px solid #2a1500" }}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[13px] text-white leading-snug truncate">
                                                                <Highlight text={product.name} query={query} />
                                                            </p>
                                                            <p className="text-[11px] mt-0.5" style={{ color: "#664433" }}>
                                                                <Highlight text={product.category} query={query} />
                                                                {" · "}
                                                                <Highlight text={product.variant} query={query} />
                                                            </p>
                                                        </div>
                                                        <p className="heading text-[14px] flex-shrink-0" style={{ color: "#ff6b00" }}>
                                                            ${product.price}
                                                        </p>
                                                    </button>
                                                    {i < suggestions.length - 1 && (
                                                        <div className="mx-3 h-px" style={{ background: "#1e1000" }} />
                                                    )}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="px-4 py-2.5" style={{ borderTop: "1px solid #1e1000" }}>
                                            <p className="text-[10px]" style={{ color: "#2a1500" }}>
                                                ↑↓ navigate · Enter to select · Esc to close
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="px-5 py-8 text-center">
                                        <p className="text-2xl mb-2">🔍</p>
                                        <p className="text-sm" style={{ color: "#664433" }}>
                                            No results for <span className="text-white font-medium">"{query}"</span>
                                        </p>
                                        <p className="text-xs mt-1" style={{ color: "#2a1500" }}>Try a different keyword</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Account button */}
                    <Link
                        to="/login"
                        className="w-8 h-8 flex items-center justify-center transition-colors flex-shrink-0"
                        style={{ color: "#664433" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#ff6b00"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#664433"}
                        aria-label="Account"
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </Link>

                    {/* Cart button */}
                    <button
                        onClick={onCartOpen}
                        className="neon-btn relative flex items-center gap-2 rounded-lg px-4 py-2 text-xs tracking-widest uppercase font-bold flex-shrink-0 transition-all hover:scale-105 text-white"
                        style={{ background: "linear-gradient(135deg, #ff6b00, #ff0040)" }}
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        Cart
                        {cartCount > 0 && (
                            <span
                                className="cart-badge w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center -ml-1"
                                style={{ background: "#0d0800", color: "#ff6b00" }}
                            >
                                {cartCount}
                            </span>
                        )}
                    </button>

                </div>
            </div>
        </nav>
    );
}