import { useState } from "react";
import { SHIPPING_THRESHOLD } from "../data/constants";
import CartItem from "./CartItem";

// Props aligned with Layout.jsx:
// open, onClose, cart, updateQty, removeItem, onOrderComplete
export default function CartPanel({ open, onClose, cart, updateQty, removeItem, onOrderComplete }) {
    const [promoCode, setPromoCode]       = useState("");
    const [promoApplied, setPromoApplied] = useState(false);
    const [removingId, setRemovingId]     = useState(null);

    const handleRemove = (id) => {
        setRemovingId(id);
        setTimeout(() => { removeItem(id); setRemovingId(null); }, 350);
    };

    const applyPromo = () => {
        if (promoCode.toUpperCase() === "SAVE10") setPromoApplied(true);
    };

    const subtotal    = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const discount    = promoApplied ? subtotal * 0.1 : 0;
    const shipping    = subtotal >= SHIPPING_THRESHOLD ? 0 : 5.99;
    const total       = subtotal - discount + shipping;
    const cartCount   = cart.reduce((s, i) => s + i.qty, 0);
    const progressPct = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);

    const fmt = (n) => `$${n.toFixed(2)}`;

    const handleCheckout = () => {
        onOrderComplete?.({ cart, subtotal, discount, shipping, total, promoApplied, promoCode });
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={onClose}
                style={{ animation: "fadeIn 0.25s ease" }}
            />

            {/* Panel */}
            <div
                className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col border-l border-[#1e1000]"
                style={{
                    background: "#0d0800",
                    animation: "slideIn 0.35s cubic-bezier(0.22,1,0.36,1)",
                    boxShadow: "-8px 0 60px rgba(0,0,0,0.6)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e1000]">
                    <div>
                        <p className="text-[10px] tracking-[0.3em] uppercase text-[#ff6b00]">Your Bag</p>
                        <h2 className="heading text-2xl text-white">CART ({cartCount})</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 border border-[#2a1500] rounded flex items-center justify-center transition-all"
                        style={{ color: "#555" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ff6b00"; e.currentTarget.style.color = "#ff6b00"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a1500"; e.currentTarget.style.color = "#555"; }}
                    >
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">

                    {/* Shipping progress bar */}
                    {shipping > 0 && (
                        <div className="bg-[#110700] rounded-xl px-4 py-3 border border-[#1e1000]">
                            <div className="flex justify-between text-xs text-[#444] mb-2">
                                <span>
                                    Add{" "}
                                    <span className="text-white font-medium">
                                        {fmt(SHIPPING_THRESHOLD - subtotal)}
                                    </span>{" "}
                                    for free shipping
                                </span>
                                <span>{(SHIPPING_THRESHOLD)}</span>
                            </div>
                            <div className="h-1 bg-[#1e1000] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${progressPct}%`,
                                        background: "linear-gradient(90deg, #ff6b00, #ff0040)",
                                        transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    {shipping === 0 && cart.length > 0 && (
                        <div
                            className="text-xs tracking-wide rounded-xl px-4 py-3 flex items-center gap-2"
                            style={{ background: "#0d1a00", border: "1px solid #1a3000", color: "#4ade80" }}
                        >
                            ⚡ Free shipping unlocked!
                        </div>
                    )}

                    {/* Items */}
                    {cart.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-4xl mb-4">🛒</p>
                            <p className="heading text-2xl text-white mb-1">BAG IS EMPTY</p>
                            <p className="text-sm text-[#444]">Add some gear to get started</p>
                        </div>
                    ) : (
                        <div className="bg-[#110700] rounded-2xl overflow-hidden border border-[#1e1000]">
                            {cart.map((item, i) => (
                                <div key={item.id}>
                                    <CartItem
                                        item={item}
                                        onUpdateQty={updateQty}
                                        onRemove={handleRemove}
                                        isRemoving={removingId === item.id}
                                    />
                                    {i < cart.length - 1 && <div className="mx-4 h-px bg-[#1a0e00]" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="px-6 py-5 border-t border-[#1e1000]" style={{ background: "#0d0800" }}>

                        {/* Promo input */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Promo code (SAVE10)"
                                className="flex-1 rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-colors placeholder-[#333]"
                                style={{ background: "#110700", border: "1px solid #2a1500" }}
                                onFocus={(e) => e.currentTarget.style.borderColor = "#ff6b00"}
                                onBlur={(e)  => e.currentTarget.style.borderColor = "#2a1500"}
                            />
                            <button
                                onClick={applyPromo}
                                disabled={promoApplied}
                                className="px-4 py-2 rounded-lg text-xs font-bold transition-all tracking-widest uppercase disabled:opacity-40"
                                style={{ border: "1px solid #ff6b0044", color: "#ff6b00" }}
                                onMouseEnter={(e) => { if (!promoApplied) { e.currentTarget.style.background = "#ff6b00"; e.currentTarget.style.color = "#0d0800"; } }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ff6b00"; }}
                            >
                                {promoApplied ? "✓" : "Apply"}
                            </button>
                        </div>

                        {/* Price breakdown */}
                        <div className="space-y-1.5 text-xs text-[#444] mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-white">{fmt(subtotal)}</span>
                            </div>
                            {promoApplied && (
                                <div className="flex justify-between" style={{ color: "#4ade80" }}>
                                    <span>SAVE10 (−10%)</span>
                                    <span>−{fmt(discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span style={{ color: shipping === 0 ? "#4ade80" : "#fff" }}>
                                    {shipping === 0 ? "Free" : fmt(shipping)}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-baseline mb-4">
                            <span className="heading text-lg text-white">TOTAL</span>
                            <span className="heading text-2xl" style={{ color: "#ff6b00" }}>
                                {fmt(total)}
                            </span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="neon-btn w-full rounded-lg py-3.5 text-xs tracking-widest uppercase font-bold transition-all hover:scale-[1.02]"
                            style={{ background: "linear-gradient(135deg,#ff6b00,#ff0040)", color: "#fff" }}
                        >
                            Checkout ⚡
                        </button>
                        <p className="text-center text-[10px] text-[#222] mt-3 tracking-wide">
                            Secure checkout · Free returns · SSL encrypted
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}