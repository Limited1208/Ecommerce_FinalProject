import { useState } from "react";
import { PRODUCTS, SHIPPING_THRESHOLD } from "../data/constants";


function CartRow({ item, onUpdateQty, onRemove, isRemoving }) {
    return (
        <div
            className="flex gap-5 p-5"
            style={{
                opacity: isRemoving ? 0 : 1,
                transform: isRemoving ? "translateX(28px)" : "none",
                transition: "opacity 0.35s ease, transform 0.35s ease",
            }}
        >
            <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-2xl flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                    <div>
                        {item.badge && (
                            <span className="inline-block mb-1 text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#2c2c2c] text-white">
                                {item.badge}
                            </span>
                        )}
                        <p className="heading text-[15px] text-[#2c2c2c] leading-snug">{item.name}</p>
                        <p className="text-xs text-[#aaa] mt-0.5">{item.variant}</p>
                        <p className="text-[10px] tracking-widest uppercase text-[#c8a96e] mt-1">{item.category}</p>
                    </div>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="text-[#ccc] text-xl mt-0.5 leading-none hover:text-[#c0392b] transition-colors"
                        aria-label="Remove"
                    >
                        ×
                    </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 border border-[#e8e8e8] rounded-full px-2 py-1">
                        <button
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-sm text-[#555] hover:bg-[#2c2c2c] hover:text-[#f5f0eb] transition-all"
                        >
                            −
                        </button>
                        <span className="text-sm w-4 text-center text-[#2c2c2c]">{item.qty}</span>
                        <button
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-sm text-[#555] hover:bg-[#2c2c2c] hover:text-[#f5f0eb] transition-all"
                        >
                            +
                        </button>
                    </div>

                    <div className="text-right">
                        <p className="heading text-[15px] text-[#2c2c2c]">
                            ${(item.price * item.qty).toLocaleString()}
                        </p>
                        {item.qty > 1 && (
                            <p className="text-xs text-[#bbb]">${item.price} each</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


function OrderSummary({
    subtotal, discount, shipping, total,
    promoApplied, promoCode, setPromoCode, onApplyPromo,
}) {
    return (
        <div className="bg-white rounded-3xl shadow-sm p-6 sticky top-6">
            <h2 className="heading text-xl text-[#2c2c2c] mb-5">Order Summary</h2>

            {/* Promo */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (try SAVE10)"
                    className="flex-1 border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-sm text-[#444] bg-[#fafafa] focus:outline-none focus:border-[#2c2c2c] transition-colors"
                />
                <button
                    onClick={onApplyPromo}
                    disabled={promoApplied}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium border border-[#2c2c2c] text-[#2c2c2c] hover:bg-[#2c2c2c] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {promoApplied ? "Applied ✓" : "Apply"}
                </button>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 text-sm text-[#777]">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#2c2c2c]">${subtotal.toLocaleString()}</span>
                </div>
                {promoApplied && (
                    <div className="flex justify-between text-[#3a7a4a]">
                        <span>Promo (SAVE10)</span>
                        <span>−${discount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-[#3a7a4a]" : "text-[#2c2c2c]"}>
                        {shipping === 0 ? "Free" : `$${shipping}`}
                    </span>
                </div>
            </div>

            <div className="my-5 h-px bg-[#f0f0f0]" />

            <div className="flex justify-between items-baseline mb-6">
                <span className="heading text-lg text-[#2c2c2c]">Total</span>
                <span className="heading text-2xl text-[#2c2c2c]">
                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>

            <button className="w-full bg-[#2c2c2c] text-white rounded-2xl py-4 text-sm tracking-widest uppercase hover:bg-[#111] hover:tracking-[0.12em] transition-all">
                Proceed to Checkout →
            </button>

            <p className="text-center text-xs text-[#bbb] mt-4 tracking-wide">
                Secure checkout · Free returns · SSL encrypted
            </p>

            <div className="flex justify-center gap-2 mt-4">
                {["VISA", "MC", "AMEX", "PayPal"].map((p) => (
                    <span key={p} className="text-[9px] tracking-widest border border-[#e8e8e8] rounded px-1.5 py-0.5 text-[#aaa]">
                        {p}
                    </span>
                ))}
            </div>
        </div>
    );
}


function SuggestedProducts({ cartIds, onAddToCart }) {
    const [addedIds, setAddedIds] = useState([]);
    const suggestions = PRODUCTS.filter((p) => !cartIds.includes(p.id)).slice(0, 3);
    if (!suggestions.length) return null;

    const handleAdd = (p) => {
        onAddToCart(p);
        setAddedIds((prev) => [...prev, p.id]);
        setTimeout(() => setAddedIds((prev) => prev.filter((id) => id !== p.id)), 1800);
    };

    return (
        <div className="mt-10">
            <p className="text-xs tracking-widest uppercase text-[#c8a96e] mb-1">Complete the look</p>
            <h2 className="heading text-2xl text-[#2c2c2c] mb-5">You May Also Like</h2>
            <div className="grid grid-cols-3 gap-4">
                {suggestions.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm group">
                        <div className="aspect-[4/5] overflow-hidden bg-[#f5f0eb] relative">
                            <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {p.badge && (
                                <span className="absolute top-2 left-2 text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#2c2c2c] text-white">
                                    {p.badge}
                                </span>
                            )}
                        </div>
                        <div className="p-3">
                            <p className="text-[10px] tracking-widest uppercase text-[#c8a96e]">{p.category}</p>
                            <p className="heading text-[13px] text-[#2c2c2c] leading-snug mt-0.5">{p.name}</p>
                            <div className="flex items-center justify-between mt-2">
                                <p className="heading text-[13px] text-[#2c2c2c]">${p.price}</p>
                                <button
                                    onClick={() => handleAdd(p)}
                                    className="text-[10px] tracking-widest uppercase rounded-full px-2.5 py-1 transition-all"
                                    style={{
                                        background: addedIds.includes(p.id) ? "#3a7a4a" : "transparent",
                                        color: addedIds.includes(p.id) ? "#fff" : "#2c2c2c",
                                        border: addedIds.includes(p.id) ? "1px solid #3a7a4a" : "1px solid #2c2c2c",
                                    }}
                                >
                                    {addedIds.includes(p.id) ? "Added ✓" : "+ Add"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────
   Main Page
   Props from App:
     cart, setCart, updateQty, removeItem  — shared cart state
     orderData                             — snapshot passed from CartPanel
     onContinueShopping                    — navigate back to home
───────────────────────────── */
export default function ShoppingCart({
    cart,
    setCart,
    updateQty,
    removeItem,
    orderData,       // { cart, subtotal, discount, shipping, total, promoApplied, promoCode }
    onContinueShopping,
}) {
    const [removingId, setRemovingId] = useState(null);

    // Promo state — pre-filled if user already applied one in the drawer
    const [promoCode, setPromoCode] = useState(orderData?.promoCode ?? "");
    const [promoApplied, setPromoApplied] = useState(orderData?.promoApplied ?? false);

    const handleRemove = (id) => {
        setRemovingId(id);
        setTimeout(() => {
            removeItem(id);
            setRemovingId(null);
        }, 350);
    };

    const addSuggested = (product) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const applyPromo = () => {
        if (promoCode.toUpperCase() === "SAVE10") setPromoApplied(true);
    };

    // Recompute live from current cart (in case user edits after arriving)
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = promoApplied ? subtotal * 0.1 : 0;
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 15;
    const total = subtotal - discount + shipping;
    const progressPct = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);
    const cartIds = cart.map((i) => i.id);

    return (
        <div
            className="min-h-screen bg-[#f5f0eb] py-12 px-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .heading { font-family: 'Playfair Display', serif; }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .fade-in { animation: slideUp 0.55s ease both; }
      `}</style>

            <div className="max-w-5xl mx-auto">

                {/* ── Header ── */}
                <div className="fade-in flex items-end justify-between mb-8">
                    <div>
                        <button
                            onClick={onContinueShopping}
                            className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#aaa] hover:text-[#2c2c2c] transition-colors mb-3"
                        >
                            ← Continue Shopping
                        </button>
                        <p className="text-xs tracking-widest text-[#999] uppercase mb-1">Your Selection</p>
                        <h1 className="heading text-4xl text-[#2c2c2c]">Shopping Cart</h1>
                    </div>
                    <span className="text-sm text-[#888]">
                        {cart.length} item{cart.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* ── Free Shipping Bar ── */}
                {cart.length > 0 && (
                    <div className="fade-in mb-5" style={{ animationDelay: "0.05s" }}>
                        {shipping > 0 ? (
                            <div className="bg-white rounded-2xl px-5 py-4 shadow-sm">
                                <div className="flex justify-between text-xs text-[#888] mb-2">
                                    <span>
                                        Add{" "}
                                        <span className="font-medium text-[#2c2c2c]">
                                            ${(SHIPPING_THRESHOLD - subtotal).toFixed(0)}
                                        </span>{" "}
                                        more for free shipping
                                    </span>
                                    <span>${SHIPPING_THRESHOLD}</span>
                                </div>
                                <div className="h-1 bg-[#eee] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-[#c8a96e]"
                                        style={{
                                            width: `${progressPct}%`,
                                            transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#eaf4ee] text-[#3a7a4a] text-xs tracking-wide rounded-2xl px-5 py-3 flex items-center gap-2">
                                <span>✦</span> You've unlocked free shipping!
                            </div>
                        )}
                    </div>
                )}

                {/* ── Two-column layout ── */}
                <div className="grid md:grid-cols-[1fr_360px] gap-6 items-start">

                    {/* LEFT — cart items + suggestions */}
                    <div className="fade-in" style={{ animationDelay: "0.1s" }}>
                        {cart.length === 0 ? (
                            <div className="bg-white rounded-3xl shadow-sm py-20 text-center text-[#bbb]">
                                <p className="heading text-2xl mb-3">Your cart is empty</p>
                                <button
                                    onClick={onContinueShopping}
                                    className="text-xs tracking-widest uppercase border border-[#2c2c2c] text-[#2c2c2c] px-6 py-2.5 rounded-full hover:bg-[#2c2c2c] hover:text-white transition-all"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                                {cart.map((item, i) => (
                                    <div key={item.id}>
                                        <CartRow
                                            item={item}
                                            onUpdateQty={updateQty}
                                            onRemove={handleRemove}
                                            isRemoving={removingId === item.id}
                                        />
                                        {i < cart.length - 1 && <div className="mx-5 h-px bg-[#f2f2f2]" />}
                                    </div>
                                ))}
                            </div>
                        )}

                        <SuggestedProducts cartIds={cartIds} onAddToCart={addSuggested} />
                    </div>

                    {/* RIGHT — order summary */}
                    <div className="fade-in" style={{ animationDelay: "0.18s" }}>
                        <OrderSummary
                            subtotal={subtotal}
                            discount={discount}
                            shipping={shipping}
                            total={total}
                            promoApplied={promoApplied}
                            promoCode={promoCode}
                            setPromoCode={setPromoCode}
                            onApplyPromo={applyPromo}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}