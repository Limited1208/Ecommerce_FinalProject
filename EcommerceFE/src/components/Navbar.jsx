import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FiSearch, FiX, FiShoppingBag, FiUser,
    FiChevronDown, FiLogOut, FiPackage, FiHeart, FiSettings,
} from "react-icons/fi";
import { useProducts } from "../hooks/useProducts";
import { useUser } from "../hooks/useUser";

/* ── Highlight matched substring ── */
function Highlight({ text, query }) {
    if (!query) return <span>{text}</span>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
        <span>
            {text.slice(0, idx)}
            <mark className="rounded px-0.5 not-italic font-semibold bg-[#ff6b0020] text-[#ff6b00]">
                {text.slice(idx, idx + query.length)}
            </mark>
            {text.slice(idx + query.length)}
        </span>
    );
}

/* ── Avatar initials ── */
function getInitials(user) {
    if (!user) return "?";
    if (user.fullName) {
        const parts = user.fullName.trim().split(" ");
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0][0].toUpperCase();
    }
    return user.email?.[0]?.toUpperCase() ?? "?";
}

export default function Navbar({ cartCount, onCartOpen, onLogoClick, onSearch }) {
    const [expanded, setExpanded] = useState(false);
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const inputRef = useRef(null);
    const wrapperRef = useRef(null);
    const userMenuRef = useRef(null);

    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { products } = useProducts();
    const { user, isLoggedIn, logout } = useUser();

    const NAV_LINKS = [
        { label: "New Drops", to: "/" },
        { label: "Running", to: "/running" },
        { label: "Apparel", to: "/apparel" },
        { label: "Sale", to: "/sale" },
    ];

    const USER_MENU = [
        { icon: FiUser, label: "My Profile", to: "/profile" },
        { icon: FiPackage, label: "My Orders", to: "/orders" },
        { icon: FiHeart, label: "Wishlist", to: "/wishlist" },
        { icon: FiSettings, label: "Settings", to: "/settings" },
    ];

    /* Search suggestions */
    const q = query.trim().toLowerCase();
    const suggestions = q
        ? products
            .filter((p) =>
                p.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.variant.toLowerCase().includes(q)
            )
            .slice(0, 6)
        : [];
    const showDropdown = expanded && focused && query.trim().length > 0;

    /* Close search on outside click */
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

    /* Close user menu on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const openSearch = () => { setExpanded(true); setTimeout(() => inputRef.current?.focus(), 50); };
    const closeSearch = () => { setExpanded(false); setQuery(""); setFocused(false); setActiveIdx(-1); onSearch?.(""); };
    const handleChange = (e) => { setQuery(e.target.value); setActiveIdx(-1); onSearch?.(e.target.value); };

    const selectSuggestion = (product) => {
        setQuery(""); setFocused(false);
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
        <nav
            className="sticky top-0 z-30 backdrop-blur-md"
            style={{ background: "rgba(13,8,0,0.95)", borderBottom: "1px solid #1e1000" }}
        >
            <style>{`
        .search-bar {
          width: 0; opacity: 0; padding: 0;
          transition: width 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease, padding 0.3s ease;
          pointer-events: none;
        }
        .search-bar.open { width: 220px; opacity: 1; padding: 0 12px; pointer-events: all; }
        @media (max-width: 640px) { .search-bar.open { width: 130px; } }
        .dropdown-enter, .user-menu-enter {
          animation: dropIn 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">

                {/* ── Logo ── */}
                <button
                    onClick={onLogoClick}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
                >
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

                {/* ── Nav links ── */}
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

                {/* ── Actions ── */}
                <div className="flex items-center gap-3">

                    {/* Search */}
                    <div className="relative" ref={wrapperRef}>
                        <div
                            className="flex items-center rounded-lg"
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
                                {expanded ? <FiX size={14} /> : <FiSearch size={16} />}
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

                        {/* Search dropdown */}
                        {showDropdown && (
                            <div
                                className="dropdown-enter absolute right-0 top-[calc(100%+10px)] w-80 rounded-xl overflow-hidden z-50"
                                style={{
                                    background: "#150900",
                                    border: "1px solid #2a1500",
                                    boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 32px rgba(255,107,0,0.08)",
                                }}
                            >
                                {suggestions.length > 0 ? (
                                    <>
                                        <div className="px-4 pt-3 pb-1.5">
                                            <p className="text-[10px] tracking-widest uppercase text-[#664433]">
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
                                                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-[#2a1500]"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[13px] text-white leading-snug truncate">
                                                                <Highlight text={product.name} query={query} />
                                                            </p>
                                                            <p className="text-[11px] mt-0.5 text-[#664433]">
                                                                <Highlight text={product.category} query={query} />
                                                                {" · "}
                                                                <Highlight text={product.variant} query={query} />
                                                            </p>
                                                        </div>
                                                        <p className="heading text-[14px] text-[#ff6b00] flex-shrink-0">
                                                            ${product.price}
                                                        </p>
                                                    </button>
                                                    {i < suggestions.length - 1 && (
                                                        <div className="mx-3 h-px bg-[#1e1000]" />
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="px-4 py-2.5 border-t border-[#1e1000]">
                                            <p className="text-[10px] text-[#2a1500]">
                                                ↑↓ navigate · Enter to select · Esc to close
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="px-5 py-8 text-center">
                                        <FiSearch size={22} className="mx-auto mb-2 text-[#664433]" />
                                        <p className="text-sm text-[#664433]">
                                            No results for{" "}
                                            <span className="text-white font-medium">"{query}"</span>
                                        </p>
                                        <p className="text-xs mt-1 text-[#2a1500]">Try a different keyword</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Logged OUT ── */}
                    {!isLoggedIn && (
                        <Link
                            to="/login"
                            className="w-8 h-8 flex items-center justify-center text-[#664433] hover:text-[#ff6b00] transition-colors flex-shrink-0"
                            aria-label="Sign in"
                        >
                            <FiUser size={18} />
                        </Link>
                    )}

                    {/* ── Logged IN: avatar + dropdown ── */}
                    {isLoggedIn && (
                        <div className="relative flex-shrink-0" ref={userMenuRef}>
                            {/* Trigger */}
                            <button
                                onClick={() => setUserMenuOpen((v) => !v)}
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                aria-label="User menu"
                            >
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                                    style={{ background: "linear-gradient(135deg,#ff6b00,#ff0040)" }}
                                >
                                    {getInitials(user)}
                                </div>
                                <span className="hidden md:block text-xs font-semibold text-[#aa8866] max-w-[80px] truncate">
                                    {user?.fullName?.split(" ")[0] ?? user?.email?.split("@")[0]}
                                </span>
                                <FiChevronDown
                                    size={12}
                                    className="hidden md:block text-[#664433] transition-transform duration-200"
                                    style={{ transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                />
                            </button>

                            {/* Dropdown */}
                            {userMenuOpen && (
                                <div
                                    className="user-menu-enter absolute right-0 top-[calc(100%+12px)] w-56 rounded-xl overflow-hidden z-50"
                                    style={{
                                        background: "#130900",
                                        border: "1px solid #2a1500",
                                        boxShadow: "0 16px 48px rgba(0,0,0,0.7), 0 0 24px rgba(255,107,0,0.06)",
                                    }}
                                >
                                    {/* User info header */}
                                    <div className="px-4 py-3.5 border-b border-[#1e1000]">
                                        <p className="text-xs font-semibold text-white truncate">
                                            {user?.fullName ?? "My Account"}
                                        </p>
                                        <p className="text-[11px] text-[#664433] truncate mt-0.5">
                                            {user?.email}
                                        </p>
                                    </div>

                                    {/* Menu items */}
                                    <div className="py-1.5">
                                        {USER_MENU.map(({ icon: Icon, label, to }) => (
                                            <Link
                                                key={label}
                                                to={to}
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-xs text-[#aa8866] hover:bg-[#1e1000] hover:text-white transition-colors no-underline"
                                            >
                                                <Icon size={14} className="flex-shrink-0" />
                                                {label}
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Logout */}
                                    <div className="border-t border-[#1e1000] py-1.5">
                                        <button
                                            onClick={() => { setUserMenuOpen(false); logout(); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#ff0040] hover:bg-[#1a0005] transition-colors text-left"
                                        >
                                            <FiLogOut size={14} className="flex-shrink-0" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Cart ── */}
                    <button
                        onClick={onCartOpen}
                        className="neon-btn relative flex items-center gap-2 rounded-lg px-4 py-2 text-xs tracking-widest uppercase font-bold flex-shrink-0 transition-all hover:scale-105 text-white"
                        style={{ background: "linear-gradient(135deg, #ff6b00, #ff0040)" }}
                    >
                        <FiShoppingBag size={14} />
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