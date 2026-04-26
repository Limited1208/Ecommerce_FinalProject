/* ═══════════════════════════════════════════════════════════
    Design Token File
    Import: import { colors, gradients, shadows, keyframes, animate, tw } from "../styles/theme"
═══════════════════════════════════════════════════════════ */

/* ── Raw color tokens ── */
export const colors = {
    // Backgrounds
    bg: "#0d0800",   // page background
    bgCard: "#130900",   // card / panel background
    bgInput: "#110700",   // input background
    bgHover: "#1e0a00",   // hovered card / option
    bgDeep: "#160a00",   // image background

    // Borders
    border: "#2a1500",   // default border
    borderSub: "#1e1000",   // subtle border (dividers, inner)
    borderFaint: "#2a0010",   // faint red-tinted (sale section)

    // Brand
    orange: "#ff6b00",   // primary accent
    red: "#ff0040",   // secondary accent / danger / sale

    // Text
    white: "#fff",
    textMuted: "#aa8866",   // body text on dark bg
    textDim: "#664433",   // labels, secondary text
    textFaint: "#2a1500",   // placeholders, disabled
    textDark: "#443322",   // very dark (material / care notes)

    // Status
    success: "#4ade80",   // free shipping unlocked, promo savings

    // Overlays
    overlay: "rgba(0,0,0,0.8)",
    overlayLight: "rgba(0,0,0,0.6)",
};

/* ── Gradient strings ── */
export const gradients = {
    // Backgrounds
    brand: "linear-gradient(135deg, #ff6b00, #ff0040)",   // buttons, badges
    brandH: "linear-gradient(90deg,  #ff6b00, #ff0040)",   // horizontal (progress, ticker)
    brandV: "linear-gradient(180deg, #ff6b00, #ff0040)",   // vertical (countdown digits)
    heroDark: "linear-gradient(135deg, #2c2c2c 0%, #4a3f35 100%)",
    saleDark: "linear-gradient(135deg, #1a0000 0%, #0d0800 55%, #1a0005 100%)",
    ctaDark: "linear-gradient(135deg, #1a0000, #0d0800, #1a0005)",
    statsDark: "linear-gradient(135deg, #130900, #1a0005)",

    // Clip-to-text (spread these as style props)
    brandText: {
        background: "linear-gradient(90deg, #ff6b00, #ff0040)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
};

/* ── Box shadows ── */
export const shadows = {
    card: "0 8px 40px rgba(255,107,0,0.1)",
    cardHover: "0 12px 48px rgba(255,107,0,0.15)",
    modal: "0 40px 100px rgba(0,0,0,0.9), 0 0 60px rgba(255,107,0,0.07)",
    panel: "-8px 0 60px rgba(0,0,0,0.6)",
    btnGlow: "0 8px 24px rgba(255,107,0,0.3)",
    btnGlowHover: "0 12px 32px rgba(255,107,0,0.45)",
    stepActive: "0 0 16px rgba(255,107,0,0.4)",
    badge: "0 4px 12px rgba(255,0,64,0.5)",
    navbarGlow: "0 0 32px rgba(255,107,0,0.08)",
};

/* ── CSS keyframes — inject once via <style>{keyframes}</style> ── */
export const keyframes = `
  @keyframes fadeIn    { from { opacity: 0 }                              to { opacity: 1 } }
  @keyframes slideIn   { from { transform: translateX(100%) }             to { transform: translateX(0) } }
  @keyframes slideUp   { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes fadeUp    { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes modalIn   { from { opacity: 0; transform: scale(0.95) translateY(16px) } to { opacity: 1; transform: scale(1) translateY(0) } }
  @keyframes spin      { to   { transform: rotate(360deg) } }
  @keyframes ticker    { from { transform: translateX(0) }                to { transform: translateX(-50%) } }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 16px rgba(255,0,64,0.4); }
    50%       { box-shadow: 0 0 40px rgba(255,0,64,0.8); }
  }
  @keyframes pulseFire {
    0%, 100% { box-shadow: 0 0 8px #ff6b0055, 0 0 16px #ff000033; }
    50%       { box-shadow: 0 0 20px #ff6b00aa, 0 0 40px #ff000055; }
  }
  @keyframes toastIn {
    0%   { opacity: 0; transform: translateY(16px); }
    15%  { opacity: 1; transform: translateY(0); }
    80%  { opacity: 1; }
    100% { opacity: 0; transform: translateY(-8px); }
  }
  ::placeholder { color: #2a1500; }
  select option  { background: #110700; color: #fff; }
`;

/* ── Tailwind className shorthands ── */
export const tw = {
    // ── Containers
    card: "bg-[#130900] border border-[#2a1500] rounded-2xl",
    cardPadded: "bg-[#130900] border border-[#2a1500] rounded-2xl p-6",
    cardPaddedLg: "bg-[#130900] border border-[#2a1500] rounded-2xl p-8",

    // ── Form elements
    input: "w-full px-3.5 py-2.5 bg-[#110700] border border-[#2a1500] rounded-lg text-sm text-white outline-none transition-colors duration-300 ease-out focus:border-[#ff6b00] placeholder-[#2a1500]",
    select: "w-full px-3.5 py-2.5 bg-[#110700] border border-[#2a1500] rounded-lg text-sm text-white outline-none transition-colors duration-300 ease-out focus:border-[#ff6b00] cursor-pointer",

    // ── Buttons
    btnPrimary: "px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase text-white cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] border-none",
    btnGhost: "px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase border border-[#2a1500] text-[#664433] bg-transparent cursor-pointer transition-all duration-300 ease-out hover:border-[#ff6b00] hover:text-[#ff6b00]",
    btnIcon: "w-8 h-8 border border-[#2a1500] rounded flex items-center justify-center text-[#555] transition-all duration-300 ease-out hover:border-[#ff6b00] hover:text-[#ff6b00]",
    btnCheckout: "w-full rounded-lg py-3.5 text-xs tracking-widest uppercase font-bold text-white transition-all duration-300 ease-out hover:scale-[1.02] border-none cursor-pointer",

    // ── Typography
    label: "text-[10px] tracking-[0.2em] uppercase text-[#664433]",
    labelOrange: "text-[10px] tracking-[0.2em] uppercase text-[#ff6b00]",
    caption: "text-[11px] text-[#664433]",
    muted: "text-sm text-[#aa8866] leading-relaxed",
    error: "text-[10px] text-[#ff0040]",

    // ── Dividers
    divider: "border-t border-[#1e1000]",
    dividerFull: "h-px bg-[#1e1000]",

    // ── Badges
    badgeNew: "text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded bg-[#ff6b00] text-white",
    badgeSale: "text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded bg-[#ff0040] text-white",
    badgeGeneric: "text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded bg-[#2a1500] text-white",

    // ── Layout helpers
    pageWrapper: "max-w-[1100px] mx-auto px-6 py-12",
    section: "max-w-6xl mx-auto px-6 py-12",
    heroInner: "max-w-[1100px] mx-auto px-6 py-16 relative z-10",

    // ── Overlay / backdrop
    backdrop: "fixed inset-0 bg-black/80 backdrop-blur-md z-50",
    backdropLight: "fixed inset-0 bg-black/60 backdrop-blur-sm z-40",
};