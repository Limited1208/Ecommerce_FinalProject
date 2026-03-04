import { useState } from "react";
import { SHIPPING_THRESHOLD } from "../data/constants";
import CartItem from "./CartItem";

export default function CartPanel({ cart, onUpdateQty, onClose, onRemoveItem, onCheckout }) {
    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);
    const [removingId, setRemovingId] = useState(null);

    const handleRemove = (id) => {
        setRemovingId(id);
        setTimeout(() => { onRemoveItem(id); setRemovingId(null); }, 350);
    };

    const applyPromo = () => {
        if (promoCode.toUpperCase() === "SAVE10") setPromoApplied(true);
    };

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = promoApplied ? subtotal * 0.1 : 0;
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 15;
    const total = subtotal - discount + shipping;
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);
    const progressPct = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);

    const handleCheckout = () => {
        onCheckout({ cart, subtotal, discount, shipping, total, promoApplied, promoCode });
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} style={{ animation: "fadeIn 0.25s ease" }} />

            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0d0800] z-50 flex flex-col border-l border-[#1e1000]"
                style={{ animation: "slideIn 0.35s cubic-bezier(0.22,1,0.36,1)", boxShadow: "-8px 0 48px rgba(0,229,255,0.04)" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e1000]">
                    <div>
                        <p className="text-[10px] tracking-[0.3em] uppercase text-[#ff6b00]">Your Bag</p>
                        <h2 className="heading text-2xl text-white">CART ({cartCount})</h2>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 border border-[#2a1500] rounded flex items-center justify-center text-[#555] hover:border-[#ff6b00] hover:text-[#ff6b00] transition-all">
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {/* Shipping progress */}
                    {shipping > 0 && (
                        <div className="bg-[#110700] rounded-xl px-4 py-3 border border-[#1e1000]">
                            <div className="flex justify-between text-xs text-[#444] mb-2">
                                <span>Add <span className="text-white font-medium">${(SHIPPING_THRESHOLD - subtotal).toFixed(0)}</span> for free shipping</span>
                                <span>${SHIPPING_THRESHOLD}</span>
                            </div>
                            <div className="h-1 bg-[#1e1000] rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-[#ff6b00]"
                                    style={{ width: `${progressPct}%`, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)" }}
                                />
                            </div>
                        </div>
                    )}
                    {shipping === 0 && cart.length > 0 && (
                        <div className="bg-[#1a0800] border border-[#2a1500] text-green-400 text-xs tracking-wide rounded-xl px-4 py-3 flex items-center gap-2">
                            <span>⚡</span> Free shipping unlocked!
                        </div>
                    )}

                    {/* Items */}
                    {cart.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="heading text-2xl text-white mb-1">BAG IS EMPTY</p>
                            <p className="text-sm text-[#444]">Add some gear to get started</p>
                        </div>
                    ) : (
                        <div className="bg-[#110700] rounded-2xl overflow-hidden border border-[#1e1000]">
                            {cart.map((item, i) => (
                                <div key={item.id}>
                                    <CartItem item={item} onUpdateQty={onUpdateQty} onRemove={handleRemove} isRemoving={removingId === item.id} />
                                    {i < cart.length - 1 && <div className="mx-4 h-px bg-[#1a0e00]" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="px-6 py-5 bg-[#0d0800] border-t border-[#1e1000]">
                        {/* Promo */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Promo code (SAVE10)"
                                className="flex-1 border border-[#2a1500] rounded-lg px-3 py-2 text-xs text-white bg-[#110700] focus:outline-none focus:border-[#ff6b00] transition-colors placeholder-[#333]"
                            />
                            <button
                                onClick={applyPromo}
                                disabled={promoApplied}
                                className="px-4 py-2 rounded-lg text-xs font-bold border border-[#ff6b0044] text-[#ff6b00] hover:bg-[#ff6b00] hover:text-[#0d0800] transition-all disabled:opacity-40 tracking-widest uppercase"
                            >
                                {promoApplied ? "✓" : "Apply"}
                            </button>
                        </div>

                        <div className="space-y-1.5 text-xs text-[#444] mb-4">
                            <div className="flex justify-between"><span>Subtotal</span><span className="text-white">${subtotal}</span></div>
                            {promoApplied && <div className="flex justify-between text-green-400"><span>SAVE10</span><span>−${discount.toFixed(2)}</span></div>}
                            <div className="flex justify-between"><span>Shipping</span><span className={shipping === 0 ? "text-green-400" : "text-white"}>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
                        </div>

                        <div className="flex justify-between items-baseline mb-4">
                            <span className="heading text-lg text-white">TOTAL</span>
                            <span className="heading text-2xl text-[#ff6b00]">${total.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="neon-btn w-full bg-[#ff6b00] text-[#0d0800] rounded-lg py-3.5 text-xs tracking-widest uppercase font-bold hover:scale-[1.02] transition-all"
                        >
                            Checkout ⚡
                        </button>
                        <p className="text-center text-[10px] text-[#222] mt-3 tracking-wide">Secure checkout · Free returns · SSL encrypted</p>
                    </div>
                )}
            </div>
        </>
    );
}