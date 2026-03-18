import { useState } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { SHIPPING_THRESHOLD } from "../data/constants";


const fmt = (n) => `$${Number(n).toFixed(2)}`;

/* ── Reusable Field wrapper ── */
function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#664433]">{label}</label>
            {children}
        </div>
    );
}


/* ── Reusable Input ── */
function Input({ type = "text", placeholder, value, onChange, maxLength }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            className="w-full px-3.5 py-2.5 bg-[#110700] border border-[#2a1500] rounded-lg text-sm text-white outline-none transition-colors focus:border-[#ff6b00] placeholder-[#2a1500]"
        />
    );
}

/* ── Reusable Select ── */
function Select({ value, onChange, children }) {
    return (
        <select
            value={value}
            onChange={onChange}
            className="w-full px-3.5 py-2.5 bg-[#110700] border border-[#2a1500] rounded-lg text-sm text-white outline-none transition-colors focus:border-[#ff6b00] cursor-pointer"
        >
            {children}
        </select>
    );
}

/* ── Step indicator ── */
function Steps({ current }) {
    const steps = ["Shipping", "Payment", "Review"];
    return (
        <div className="flex items-center mb-10">
            {steps.map((label, i) => {
                const done = i < current;
                const active = i === current;
                return (
                    <div key={label} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                                style={{
                                    background: done || active ? "linear-gradient(135deg,#ff6b00,#ff0040)" : "#1e1000",
                                    color: done || active ? "#fff" : "#2a1500",
                                    border: done || active ? "none" : "1px solid #2a1500",
                                    boxShadow: active ? "0 0 16px rgba(255,107,0,0.4)" : "none",
                                }}
                            >
                                {done ? "✓" : i + 1}
                            </div>
                            <span
                                className="text-[9px] tracking-[0.15em] uppercase whitespace-nowrap"
                                style={{ color: done || active ? "#ff6b00" : "#2a1500" }}
                            >
                                {label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div
                                className="flex-1 h-px mx-2 mb-5 transition-all"
                                style={{ background: done ? "linear-gradient(90deg,#ff6b00,#ff0040)" : "#1e1000" }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ── Order summary sidebar ── */
function OrderSummary({ cart, subtotal, discount, shipping, total, promoApplied }) {
    return (
        <div className="bg-[#130900] border border-[#2a1500] rounded-2xl p-6 sticky top-6">
            <p className="heading text-lg text-white mb-5">ORDER SUMMARY</p>

            {/* Items */}
            <div className="flex flex-col gap-3.5 mb-5">
                {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                        <div className="relative flex-shrink-0">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-13 h-13 object-cover rounded-lg border border-[#2a1500]"
                                style={{ width: 52, height: 52 }}
                            />
                            <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-[#ff6b00] text-white text-[9px] font-bold flex items-center justify-center">
                                {item.qty}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-white font-semibold leading-snug truncate">{item.name}</p>
                            <p className="text-[11px] text-[#664433] mt-0.5">{item.variant}</p>
                        </div>
                        <p className="heading text-sm text-[#ff6b00] flex-shrink-0">{fmt(item.price * item.qty)}</p>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="border-t border-[#1e1000] pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-xs text-[#664433]">
                    <span>Subtotal</span><span className="text-white">{fmt(subtotal)}</span>
                </div>
                {promoApplied && (
                    <div className="flex justify-between text-xs text-green-400">
                        <span>Discount (SAVE10)</span><span>−{fmt(discount)}</span>
                    </div>
                )}
                <div className="flex justify-between text-xs text-[#664433]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-400" : "text-white"}>
                        {shipping === 0 ? "Free" : fmt(shipping)}
                    </span>
                </div>
                <div className="flex justify-between items-baseline border-t border-[#1e1000] pt-3 mt-1">
                    <span className="heading text-lg text-white">TOTAL</span>
                    <span
                        className="heading text-2xl"
                        style={{ background: "linear-gradient(90deg,#ff6b00,#ff0040)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                    >
                        {fmt(total)}
                    </span>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function CheckoutPage() {
    const context = useOutletContext() ?? {};
    const { cart = [], setCart, setOrderData } = context;
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [placing, setPlacing] = useState(false);

    const [shipping, setShippingForm] = useState({
        firstName: "", lastName: "", email: "", phone: "",
        address: "", apt: "", city: "", state: "", zip: "",
        country: "US", shippingMethod: "standard",
    });

    const [payment, setPayment] = useState({
        method: "card", cardName: "", cardNumber: "", expiry: "", cvv: "",
    });

    /* Totals */
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = context.orderData?.promoApplied ? subtotal * 0.1 : 0;
    const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : 5.99;
    const total = subtotal - discount + shippingFee;

    const setS = (k) => (e) => setShippingForm((p) => ({ ...p, [k]: e.target.value }));
    const setP = (k) => (e) => setPayment((p) => ({ ...p, [k]: e.target.value }));

    const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    const formatExpiry = (v) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };

    const validateStep0 = () => {
        const e = {};
        if (!shipping.firstName.trim()) e.firstName = "Required";
        if (!shipping.lastName.trim()) e.lastName = "Required";
        if (!shipping.email.includes("@")) e.email = "Valid email required";
        if (!shipping.address.trim()) e.address = "Required";
        if (!shipping.city.trim()) e.city = "Required";
        if (!shipping.zip.trim()) e.zip = "Required";
        setErrors(e); return Object.keys(e).length === 0;
    };

    const validateStep1 = () => {
        const e = {};
        if (payment.method === "card") {
            if (!payment.cardName.trim()) e.cardName = "Required";
            if (payment.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Invalid card number";
            if (payment.expiry.length < 5) e.expiry = "Invalid expiry";
            if (payment.cvv.length < 3) e.cvv = "Invalid CVV";
        }
        setErrors(e); return Object.keys(e).length === 0;
    };

    const nextStep = () => {
        if (step === 0 && !validateStep0()) return;
        if (step === 1 && !validateStep1()) return;
        setErrors({});
        setStep((s) => s + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const prevStep = () => { setErrors({}); setStep((s) => s - 1); };

    const placeOrder = () => {
        setPlacing(true);
        setTimeout(() => {
            const order = {
                id: "SZ-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
                date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                items: cart, shipping, payment: { method: payment.method, last4: payment.cardNumber.slice(-4) },
                subtotal, discount, shippingFee, total,
                estimated: new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
            };
            setOrderData?.(order);
            setCart?.([]);
            navigate("/order-confirmation");
        }, 1400);
    };

    const Err = ({ field }) => errors[field]
        ? <span className="text-[10px] text-[#ff0040]">{errors[field]}</span>
        : null;

    /* Empty cart guard */
    if (cart.length === 0 && !placing) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <p className="text-5xl">🛒</p>
                <p className="heading text-2xl text-white">Your cart is empty</p>
                <Link
                    to="/"
                    className="px-6 py-2.5 rounded-lg text-xs tracking-widest uppercase font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#ff6b00,#ff0040)" }}
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <>
            <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin   { to { transform: rotate(360deg) } }
        .step-panel { animation: fadeUp 0.35s ease both; }
        select option { background: #110700; color: #fff; }
      `}</style>

            <div className="max-w-[1100px] mx-auto px-6 py-12">

                {/* Back */}
                <Link
                    to="/shopping-cart"
                    className="inline-flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-[#664433] no-underline mb-8 transition-colors hover:text-[#ff6b00]"
                >
                    ← Back to cart
                </Link>

                <h1 className="heading text-5xl text-white mb-9">CHECKOUT</h1>

                <Steps current={step} />

                <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 360px" }}>

                    {/* ── Left ── */}
                    <div>

                        {/* ════ STEP 0 — Shipping ════ */}
                        {step === 0 && (
                            <div className="step-panel bg-[#130900] border border-[#2a1500] rounded-2xl p-8">
                                <p className="heading text-2xl text-white mb-6">SHIPPING INFORMATION</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="First Name"><Input placeholder="John" value={shipping.firstName} onChange={setS("firstName")} /><Err field="firstName" /></Field>
                                    <Field label="Last Name"> <Input placeholder="Doe" value={shipping.lastName} onChange={setS("lastName")} /><Err field="lastName" /></Field>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <Field label="Email"><Input type="email" placeholder="your@email.com" value={shipping.email} onChange={setS("email")} /><Err field="email" /></Field>
                                    <Field label="Phone (optional)"><Input type="tel" placeholder="+1 (555) 000-0000" value={shipping.phone} onChange={setS("phone")} /></Field>
                                </div>

                                <div className="mt-4">
                                    <Field label="Street Address"><Input placeholder="123 Main Street" value={shipping.address} onChange={setS("address")} /><Err field="address" /></Field>
                                </div>

                                <div className="mt-4">
                                    <Field label="Apt, Suite, Unit (optional)"><Input placeholder="Apt 4B" value={shipping.apt} onChange={setS("apt")} /></Field>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    <Field label="City"> <Input placeholder="New York" value={shipping.city} onChange={setS("city")} /><Err field="city" /></Field>
                                    <Field label="State"><Input placeholder="NY" value={shipping.state} onChange={setS("state")} maxLength={2} /></Field>
                                    <Field label="ZIP">  <Input placeholder="10001" value={shipping.zip} onChange={setS("zip")} maxLength={10} /><Err field="zip" /></Field>
                                </div>

                                <div className="mt-4">
                                    <Field label="Country">
                                        <Select value={shipping.country} onChange={setS("country")}>
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                            <option value="VN">Vietnam</option>
                                            <option value="SG">Singapore</option>
                                            <option value="JP">Japan</option>
                                            <option value="KR">South Korea</option>
                                        </Select>
                                    </Field>
                                </div>

                                {/* Shipping method */}
                                <div className="mt-7">
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#664433] mb-3">Shipping Method</p>
                                    {[
                                        { id: "standard", label: "Standard Shipping", sub: "5–7 business days", price: shippingFee === 0 ? "Free" : fmt(5.99) },
                                        { id: "express", label: "Express Shipping", sub: "2–3 business days", price: fmt(12.99) },
                                        { id: "overnight", label: "Overnight Shipping", sub: "Next business day", price: fmt(24.99) },
                                    ].map((opt) => {
                                        const selected = shipping.shippingMethod === opt.id;
                                        return (
                                            <label
                                                key={opt.id}
                                                className="flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer mb-2 transition-all"
                                                style={{
                                                    border: `1px solid ${selected ? "#ff6b00" : "#2a1500"}`,
                                                    background: selected ? "#1e0a00" : "#0d0800",
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                                                        style={{ border: `2px solid ${selected ? "#ff6b00" : "#2a1500"}` }}
                                                    >
                                                        {selected && <div className="w-2 h-2 rounded-full bg-[#ff6b00]" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] text-white font-semibold">{opt.label}</p>
                                                        <p className="text-[11px] text-[#664433] mt-0.5">{opt.sub}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-[13px] font-bold ${opt.id === "standard" && shippingFee === 0 ? "text-green-400" : "text-[#ff6b00]"}`}>
                                                    {opt.price}
                                                </span>
                                                <input type="radio" name="shippingMethod" value={opt.id} checked={selected} onChange={setS("shippingMethod")} className="hidden" />
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ════ STEP 1 — Payment ════ */}
                        {step === 1 && (
                            <div className="step-panel bg-[#130900] border border-[#2a1500] rounded-2xl p-8">
                                <p className="heading text-2xl text-white mb-6">PAYMENT METHOD</p>

                                {/* Method tabs */}
                                <div className="flex gap-2.5 mb-7">
                                    {[
                                        { id: "card", icon: "💳", label: "Credit Card" },
                                        { id: "paypal", icon: "🅿️", label: "PayPal" },
                                        { id: "cod", icon: "📦", label: "Cash on Delivery" },
                                    ].map((m) => {
                                        const active = payment.method === m.id;
                                        return (
                                            <button
                                                key={m.id}
                                                onClick={() => setPayment((p) => ({ ...p, method: m.id }))}
                                                className="flex-1 flex flex-col items-center gap-1.5 py-3.5 px-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all cursor-pointer"
                                                style={{
                                                    border: `1px solid ${active ? "#ff6b00" : "#2a1500"}`,
                                                    background: active ? "#1e0a00" : "#0d0800",
                                                    color: active ? "#ff6b00" : "#664433",
                                                }}
                                            >
                                                <span className="text-xl">{m.icon}</span>
                                                {m.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Card fields */}
                                {payment.method === "card" && (
                                    <div className="flex flex-col gap-4">
                                        <Field label="Name on Card"><Input placeholder="John Doe" value={payment.cardName} onChange={setP("cardName")} /><Err field="cardName" /></Field>
                                        <Field label="Card Number">
                                            <Input placeholder="0000 0000 0000 0000" value={payment.cardNumber} onChange={(e) => setPayment((p) => ({ ...p, cardNumber: formatCard(e.target.value) }))} />
                                            <Err field="cardNumber" />
                                        </Field>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field label="Expiry">
                                                <Input placeholder="MM/YY" value={payment.expiry} maxLength={5} onChange={(e) => setPayment((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))} />
                                                <Err field="expiry" />
                                            </Field>
                                            <Field label="CVV"><Input placeholder="•••" value={payment.cvv} onChange={setP("cvv")} maxLength={4} /><Err field="cvv" /></Field>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {["VISA", "MC", "AMEX", "DISC"].map((b) => (
                                                <span key={b} className="text-[9px] font-extrabold tracking-widest px-1.5 py-0.5 rounded border border-[#2a1500] text-[#664433]">{b}</span>
                                            ))}
                                            <span className="text-[11px] text-[#2a1500] ml-1">🔒 SSL Secured</span>
                                        </div>
                                    </div>
                                )}

                                {payment.method === "paypal" && (
                                    <div className="text-center p-8 rounded-xl border border-[#2a1500] bg-[#0d0800]">
                                        <p className="text-4xl mb-3">🅿️</p>
                                        <p className="text-[#aa8866] text-sm leading-relaxed">You'll be redirected to PayPal to complete your payment securely after reviewing your order.</p>
                                    </div>
                                )}

                                {payment.method === "cod" && (
                                    <div className="text-center p-8 rounded-xl border border-[#2a1500] bg-[#0d0800]">
                                        <p className="text-4xl mb-3">📦</p>
                                        <p className="text-[#aa8866] text-sm leading-relaxed">Pay with cash when your order arrives. Available for selected regions only.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ════ STEP 2 — Review ════ */}
                        {step === 2 && (
                            <div className="step-panel flex flex-col gap-4">

                                {/* Ship to */}
                                <div className="bg-[#130900] border border-[#2a1500] rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="heading text-lg text-white">SHIP TO</p>
                                        <button onClick={() => setStep(0)} className="text-[11px] tracking-widest uppercase text-[#ff6b00] bg-transparent border-none cursor-pointer">Edit</button>
                                    </div>
                                    <p className="text-sm text-[#aa8866] leading-loose">
                                        {shipping.firstName} {shipping.lastName}<br />
                                        {shipping.address}{shipping.apt ? `, ${shipping.apt}` : ""}<br />
                                        {shipping.city}{shipping.state ? `, ${shipping.state}` : ""} {shipping.zip}<br />
                                        {shipping.country}<br />
                                        <span className="text-[#664433]">{shipping.email}</span>
                                    </p>
                                </div>

                                {/* Payment */}
                                <div className="bg-[#130900] border border-[#2a1500] rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="heading text-lg text-white">PAYMENT</p>
                                        <button onClick={() => setStep(1)} className="text-[11px] tracking-widest uppercase text-[#ff6b00] bg-transparent border-none cursor-pointer">Edit</button>
                                    </div>
                                    <p className="text-sm text-[#aa8866]">
                                        {payment.method === "card" && `Credit card ending in ${payment.cardNumber.slice(-4)}`}
                                        {payment.method === "paypal" && "PayPal"}
                                        {payment.method === "cod" && "Cash on Delivery"}
                                    </p>
                                </div>

                                {/* Place order */}
                                <button
                                    onClick={placeOrder}
                                    disabled={placing}
                                    className="w-full py-4 rounded-xl text-sm font-bold tracking-widest uppercase text-white transition-all flex items-center justify-center gap-2.5 disabled:cursor-not-allowed hover:scale-[1.01]"
                                    style={{
                                        background: placing ? "#1e1000" : "linear-gradient(135deg,#ff6b00,#ff0040)",
                                        boxShadow: placing ? "none" : "0 8px 32px rgba(255,107,0,0.35)",
                                    }}
                                >
                                    {placing ? (
                                        <>
                                            <div className="w-4 h-4 rounded-full border-2 border-[#ff6b00] border-t-transparent flex-shrink-0" style={{ animation: "spin 0.7s linear infinite" }} />
                                            Placing Order…
                                        </>
                                    ) : `Place Order · ${fmt(total)}`}
                                </button>

                                <p className="text-center text-[11px] text-[#2a1500] tracking-wide">
                                    🔒 Your payment information is encrypted and secure
                                </p>
                            </div>
                        )}

                        {/* Navigation */}
                        {step < 2 && (
                            <div className="flex justify-between mt-6">
                                {step > 0 ? (
                                    <button
                                        onClick={prevStep}
                                        className="px-6 py-3 rounded-lg text-[11px] font-bold tracking-widest uppercase border border-[#2a1500] text-[#664433] bg-transparent cursor-pointer transition-all hover:border-[#ff6b00] hover:text-[#ff6b00]"
                                    >
                                        ← Back
                                    </button>
                                ) : <div />}
                                <button
                                    onClick={nextStep}
                                    className="px-8 py-3 rounded-lg text-[11px] font-bold tracking-widest uppercase text-white cursor-pointer transition-all hover:scale-[1.02]"
                                    style={{ background: "linear-gradient(135deg,#ff6b00,#ff0040)", boxShadow: "0 6px 20px rgba(255,107,0,0.3)" }}
                                >
                                    {step === 0 ? "Continue to Payment →" : "Review Order →"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar ── */}
                    <OrderSummary
                        cart={cart}
                        subtotal={subtotal}
                        discount={discount}
                        shipping={shippingFee}
                        total={total}
                        promoApplied={context.orderData?.promoApplied}
                    />
                </div>
            </div>
        </>
    );
}