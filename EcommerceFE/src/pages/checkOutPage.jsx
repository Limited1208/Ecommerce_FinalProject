import { useState, useEffect } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { SHIPPING_THRESHOLD } from "../data/constants";
import { gradients, shadows, keyframes, tw } from "../assets/theme";
import CheckoutSteps from "../components/CheckoutStep";
import FormField from "../components/FormField";
import LoadingSpinner from "../components/LoadingSpinner";
import { createOrderApi, paymentOrderApi } from "../api/orderApi";
import { useUser } from "../hooks/useUser";

const fmt = (n) => `$${Number(n).toFixed(2)}`;

/* ── Shared input ── */
function Input({ type = "text", placeholder, value, onChange, maxLength }) {
    return (
        <input type={type} placeholder={placeholder} value={value}
            onChange={onChange} maxLength={maxLength} className={tw.input} />
    );
}

/* ── Shared select ── */
function StyledSelect({ value, onChange, children }) {
    return (
        <select value={value} onChange={onChange} className={tw.select}>
            {children}
        </select>
    );
}

/* ── Inline error ── */
const Err = ({ msg }) => msg
    ? <span className="text-[10px] text-[#ff0040] mt-0.5">{msg}</span>
    : null;

/* ── Order summary sidebar ── */
function OrderSummary({ cart, subtotal, discount, shipping, total, promoApplied }) {
    return (
        <div className={`${tw.cardPadded} sticky top-6`}>
            <p className="heading text-lg text-white mb-5">ORDER SUMMARY</p>
            <div className="flex flex-col gap-3.5 mb-5">
                {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                        <div className="relative flex-shrink-0">
                            <img src={item.imageUrl ?? item.image} alt={item.name}
                                className="w-[52px] h-[52px] object-cover rounded-lg border border-[#2a1500]" />
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
                    <span className="heading text-2xl" style={gradients.brandText}>{fmt(total)}</span>
                </div>
            </div>
        </div>
    );
}

/* ── Payment method config ── */
const PAYMENT_METHODS = [
    {
        id: "vnpay",
        label: "VNPay",
        icon: (
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#005BAA" />
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                    fill="#fff" fontSize="11" fontWeight="800" fontFamily="sans-serif">
                    VN
                </text>
            </svg>
        ),
        desc: "Pay securely via VNPay gateway. Supports Visa, Mastercard & Vietnamese banks.",
    },
    {
        id: "momo",
        label: "MoMo",
        icon: (
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="20" fill="#AE2070" />
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                    fill="#fff" fontSize="10" fontWeight="800" fontFamily="sans-serif">
                    Mo
                </text>
            </svg>
        ),
        desc: "Pay with your MoMo e-wallet. Fast, secure, and instant confirmation.",
    },
    {
        id: "paypal",
        label: "PayPal",
        icon: (
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#003087" />
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                    fill="#009CDE" fontSize="11" fontWeight="900" fontFamily="sans-serif">
                    P
                </text>
            </svg>
        ),
        desc: "You'll be redirected to PayPal to complete your payment securely.",
    },
];

/* ══════════════════════════════════════
   CHECKOUT PAGE
══════════════════════════════════════ */
export default function CheckoutPage() {
    const context = useOutletContext() ?? {};
    const { cart = [], setCart, setOrderData } = context;
    const navigate = useNavigate();
    const { user } = useUser();

    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [placing, setPlacing] = useState(false);

    const [shippingForm, setShippingForm] = useState({
        firstName: "", lastName: "", email: "", phone: "",
        address: "", apt: "", city: "", state: "",
        country: "VN", shippingMethod: "standard",
    });

    const [paymentMethod, setPaymentMethod] = useState("vnpay");

    /* ── Pre-fill form from logged-in user's profile ── */
    useEffect(() => {
        if (!user) return;
        setShippingForm((prev) => ({
            ...prev,
            firstName: prev.firstName || user.firstName || "",
            lastName:  prev.lastName  || user.lastName  || "",
            email:     prev.email     || user.email     || "",
            phone:     prev.phone     || user.phone     || "",
            address:   prev.address   || user.address   || "",
            city:      prev.city      || user.city      || "",
            country:   prev.country === "VN" && user.country ? user.country : prev.country,
        }));
    }, [user]);

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = context.orderData?.promoApplied ? subtotal * 0.1 : 0;
    const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : 5.99;
    const total = subtotal - discount + shippingFee;

    const setS = (k) => (e) => setShippingForm((p) => ({ ...p, [k]: e.target.value }));


    const validateStep0 = () => {
        const e = {};
        if (!shippingForm.firstName.trim()) e.firstName = "Required";
        if (!shippingForm.lastName.trim()) e.lastName = "Required";
        if (!shippingForm.email.includes("@")) e.email = "Valid email required";
        if (!shippingForm.address.trim()) e.address = "Required";
        if (!shippingForm.city.trim()) e.city = "Required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const nextStep = () => {
        if (step === 0 && !validateStep0()) return;
        setErrors({});
        setStep((s) => s + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const prevStep = () => { setErrors({}); setStep((s) => s - 1); };

    const placeOrder = async () => {
        setPlacing(true);
        try {
            const orderPayload = {
                items: cart.map((i) => ({ productId: i.id, quantity: i.qty })),
                shippingAddress: `${shippingForm.address}${shippingForm.apt ? `, ${shippingForm.apt}` : ""}, ${shippingForm.city}${shippingForm.state ? `, ${shippingForm.state}` : ""}, ${shippingForm.country}`,
            };
            const orderRes = await createOrderApi(orderPayload);
            const orderId = orderRes.data?.data?.id ?? orderRes.data?.orderId;
            if (!orderId) {
                throw new Error("Order ID not found");
            }
            await createPayment(orderId);
        } catch (err) {
            console.error("Checkout failed:", err);
            setPlacing(false);
        }
    };

    const clearCart = () => {
    setCart([]); // clear state
    localStorage.removeItem("strkezon:cart"); // clear storage
    };

    const createPayment = async (orderId) => {
        try {
            const paymentResult = await paymentOrderApi(orderId, paymentMethod);
            const paymentUrl = paymentResult.data?.paymentUrl;
            clearCart();
            if (!paymentUrl) {
                throw new Error("No payment URL returned");
            }
            window.location.href = paymentUrl; // Redirect to payment gateway
        }
        catch (err) {
            console.error("Payment creation failed:", err);
            setPlacing(false);
        }
    }

    /* Empty cart guard */
    if (cart.length === 0 && !placing) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <p className="text-5xl">🛒</p>
                <p className="heading text-2xl text-white">Your cart is empty</p>
                <Link to="/" className={`${tw.btnPrimary} no-underline px-6 py-2.5`}
                    style={{ background: gradients.brand }}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const activeMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

    return (
        <>
            <style>{`
                ${keyframes}
                .step-panel { animation: fadeUp 0.35s ease both; }
                select option { background: #110700; color: #fff; }
            `}</style>

            <div className="max-w-[1100px] mx-auto px-6 py-12">

                <Link to="/shopping-cart"
                    className="inline-flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-[#664433] no-underline mb-8 hover:text-[#ff6b00] transition-colors">
                    ← Back to cart
                </Link>

                <h1 className="heading text-5xl text-white mb-9">CHECKOUT</h1>

                <CheckoutSteps current={step} />

                <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 360px" }}>
                    <div>

                        {/* ════ STEP 0 — Shipping ════ */}
                        {step === 0 && (
                            <div className={`step-panel ${tw.cardPadded}`} style={{ padding: 32 }}>
                                <p className="heading text-2xl text-white mb-6">SHIPPING INFORMATION</p>

                                <div className="flex flex-col gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <FormField label="First Name"><Input placeholder="John" value={shippingForm.firstName} onChange={setS("firstName")} /></FormField>
                                            <Err msg={errors.firstName} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <FormField label="Last Name"><Input placeholder="Doe" value={shippingForm.lastName} onChange={setS("lastName")} /></FormField>
                                            <Err msg={errors.lastName} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <FormField label="Email"><Input type="email" placeholder="your@email.com" value={shippingForm.email} onChange={setS("email")} /></FormField>
                                            <Err msg={errors.email} />
                                        </div>
                                        <FormField label="Phone (optional)">
                                            <Input type="tel" placeholder="+84 900 000 000" value={shippingForm.phone} onChange={setS("phone")} />
                                        </FormField>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <FormField label="Street Address">
                                            <Input placeholder="123 Nguyen Hue" value={shippingForm.address} onChange={setS("address")} />
                                        </FormField>
                                        <Err msg={errors.address} />
                                    </div>

                                    <FormField label="Apt, Suite, Unit (optional)">
                                        <Input placeholder="Apt 4B" value={shippingForm.apt} onChange={setS("apt")} />
                                    </FormField>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <FormField label="City">
                                                <Input placeholder="Ho Chi Minh City" value={shippingForm.city} onChange={setS("city")} />
                                            </FormField>
                                            <Err msg={errors.city} />
                                        </div>
                                        <FormField label="District / State">
                                            <Input placeholder="District 1" value={shippingForm.state} onChange={setS("state")} />
                                        </FormField>
                                    </div>

                                    <FormField label="Country">
                                        <StyledSelect value={shippingForm.country} onChange={setS("country")}>
                                            <option value="VN">Vietnam</option>
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                            <option value="SG">Singapore</option>
                                            <option value="JP">Japan</option>
                                            <option value="KR">South Korea</option>
                                        </StyledSelect>
                                    </FormField>

                                    {/* Shipping method */}
                                    <div>
                                        <p className={`${tw.label} mb-3`}>Shipping Method</p>
                                        {[
                                            { id: "standard", label: "Standard Shipping", sub: "5–7 business days", price: shippingFee === 0 ? "Free" : fmt(5.99) },
                                            { id: "express", label: "Express Shipping", sub: "2–3 business days", price: fmt(12.99) },
                                            { id: "overnight", label: "Overnight Shipping", sub: "Next business day", price: fmt(24.99) },
                                        ].map((opt) => {
                                            const selected = shippingForm.shippingMethod === opt.id;
                                            return (
                                                <label key={opt.id}
                                                    className="flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer mb-2 transition-all"
                                                    style={{ border: `1px solid ${selected ? "#ff6b00" : "#2a1500"}`, background: selected ? "#1e0a00" : "#0d0800" }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                                                            style={{ border: `2px solid ${selected ? "#ff6b00" : "#2a1500"}` }}>
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
                                                    <input type="radio" name="shippingMethod" value={opt.id}
                                                        checked={selected} onChange={setS("shippingMethod")} className="hidden" />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ════ STEP 1 — Payment ════ */}
                        {step === 1 && (
                            <div className={`step-panel ${tw.cardPadded}`} style={{ padding: 32 }}>
                                <p className="heading text-2xl text-white mb-6">PAYMENT METHOD</p>

                                {/* Method selector */}
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {PAYMENT_METHODS.map((m) => {
                                        const active = paymentMethod === m.id;
                                        return (
                                            <button key={m.id}
                                                onClick={() => setPaymentMethod(m.id)}
                                                className="flex flex-col items-center gap-2.5 py-4 px-3 rounded-xl transition-all cursor-pointer border-none"
                                                style={{
                                                    background: active ? "#1e0a00" : "#0d0800",
                                                    border: `1px solid ${active ? "#ff6b00" : "#2a1500"}`,
                                                    boxShadow: active ? "0 0 16px rgba(255,107,0,0.15)" : "none",
                                                }}
                                            >
                                                {m.icon}
                                                <span className="text-[11px] font-bold tracking-widest uppercase"
                                                    style={{ color: active ? "#ff6b00" : "#664433" }}>
                                                    {m.label}
                                                </span>
                                                {active && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00]" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Method description */}
                                {activeMethod && (
                                    <div className="flex items-start gap-4 p-5 rounded-xl border border-[#2a1500] bg-[#0d0800]">
                                        <div className="flex-shrink-0 mt-0.5">{activeMethod.icon}</div>
                                        <div>
                                            <p className="text-sm font-semibold text-white mb-1">{activeMethod.label}</p>
                                            <p className="text-xs text-[#664433] leading-relaxed">{activeMethod.desc}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Security note */}
                                <div className="flex items-center gap-2 mt-4">
                                    <span className="text-[#664433] text-xs">🔒</span>
                                    <p className="text-[11px] text-[#664433]">
                                        All transactions are encrypted and processed securely.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ════ STEP 2 — Review ════ */}
                        {step === 2 && (
                            <div className="step-panel flex flex-col gap-4">

                                {/* Ship to */}
                                <div className={tw.cardPadded}>
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="heading text-lg text-white">SHIP TO</p>
                                        <button onClick={() => setStep(0)}
                                            className="text-[11px] tracking-widest uppercase text-[#ff6b00] bg-transparent border-none cursor-pointer hover:opacity-70">
                                            Edit
                                        </button>
                                    </div>
                                    <p className="text-sm text-[#aa8866] leading-loose">
                                        {shippingForm.firstName} {shippingForm.lastName}<br />
                                        {shippingForm.address}{shippingForm.apt ? `, ${shippingForm.apt}` : ""}<br />
                                        {shippingForm.city}{shippingForm.state ? `, ${shippingForm.state}` : ""}<br />
                                        {shippingForm.country}<br />
                                        <span className="text-[#664433]">{shippingForm.email}</span>
                                    </p>
                                </div>

                                {/* Payment */}
                                <div className={tw.cardPadded}>
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="heading text-lg text-white">PAYMENT</p>
                                        <button onClick={() => setStep(1)}
                                            className="text-[11px] tracking-widest uppercase text-[#ff6b00] bg-transparent border-none cursor-pointer hover:opacity-70">
                                            Edit
                                        </button>
                                    </div>
                                    {activeMethod && (
                                        <div className="flex items-center gap-3">
                                            {activeMethod.icon}
                                            <p className="text-sm text-[#aa8866]">{activeMethod.label}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Place order */}
                                <button
                                    onClick={placeOrder}
                                    disabled={placing}
                                    className="w-full py-4 rounded-xl text-sm font-bold tracking-widest uppercase text-white flex items-center justify-center gap-2.5 transition-all disabled:cursor-not-allowed hover:scale-[1.01] border-none cursor-pointer"
                                    style={{
                                        background: placing ? "#1e1000" : gradients.brand,
                                        boxShadow: placing ? "none" : shadows.btnGlow,
                                    }}
                                >
                                    {placing
                                        ? <><LoadingSpinner size={16} color="#ff6b00" /> Placing Order…</>
                                        : `Place Order · ${fmt(total)}`
                                    }
                                </button>

                                <p className="text-center text-[11px] text-[#2a1500] tracking-wide">
                                    🔒 Your payment information is encrypted and secure
                                </p>
                            </div>
                        )}

                        {/* Navigation */}
                        {step < 2 && (
                            <div className="flex justify-between mt-6">
                                {step > 0
                                    ? <button onClick={prevStep} className={`${tw.btnGhost}`}>← Back</button>
                                    : <div />
                                }
                                <button onClick={nextStep} className={`${tw.btnPrimary} px-8 py-3`}
                                    style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}>
                                    {step === 0 ? "Continue to Payment →" : "Review Order →"}
                                </button>
                            </div>
                        )}
                    </div>

                    <OrderSummary cart={cart} subtotal={subtotal} discount={discount}
                        shipping={shippingFee} total={total}
                        promoApplied={context.orderData?.promoApplied} />
                </div>
            </div>
        </>
    );
}