import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    FiPackage, FiChevronDown, FiChevronRight,
    FiShoppingBag, FiClock, FiCheck, FiX, FiTruck,
} from "react-icons/fi";
import { usePageTitle } from "../hooks/usePageTitle";
import { useUser } from "../hooks/useUser";
import { getMyOrdersApi } from "../api/userApi";
import { gradients, shadows, keyframes, tw } from "../assets/theme";
import LoadingSpinner from "../components/LoadingSpinner";
import { ErrorBanner } from "../components/AlertBanner";

const fmt = (n) => `$${Number(n ?? 0).toFixed(2)}`;

function fmtDate(val) {
    if (!val) return "—";
    try {
        return new Date(val).toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "numeric",
        });
    } catch { return val; }
}

/* ── Order status badge ── */
const STATUS_CONFIG = {
    PENDING: { label: "Pending", icon: FiClock, color: "#ff6b00", bg: "rgba(255,107,0,0.12)", border: "rgba(255,107,0,0.25)" },
    PROCESSING: { label: "Processing", icon: FiPackage, color: "#ffaa00", bg: "rgba(255,170,0,0.12)", border: "rgba(255,170,0,0.25)" },
    SHIPPED: { label: "Shipped", icon: FiTruck, color: "#60a5fa", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.25)" },
    DELIVERED: { label: "Delivered", icon: FiCheck, color: "#4ade80", bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.25)" },
    CANCELLED: { label: "Cancelled", icon: FiX, color: "#ff0040", bg: "rgba(255,0,64,0.12)", border: "rgba(255,0,64,0.25)" },
};

function StatusBadge({ status }) {
    const s = STATUS_CONFIG[status?.toUpperCase()] ?? {
        label: status ?? "Unknown", icon: FiPackage,
        color: "#664433", bg: "rgba(255,255,255,0.05)", border: "#2a1500",
    };
    const Icon = s.icon;
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase whitespace-nowrap"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
        >
            <Icon size={11} />
            {s.label}
        </span>
    );
}

/* ── Single order row (expandable) ── */
function OrderRow({ order }) {
    const [open, setOpen] = useState(false);

    const items = order.items ?? order.orderItems ?? [];
    const subtotal = order.subtotal ?? order.totalPrice ?? 0;
    const shipping = order.shippingFee ?? order.shipping ?? 0;
    const discount = order.discount ?? 0;
    const total = order.total ?? order.totalAmount ?? subtotal;

    return (
        <div className="bg-[#130900] border border-[#2a1500] rounded-2xl overflow-hidden transition-all">
            {/* ── Header row ── */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#1a0a00] transition-colors text-left"
            >
                <div className="flex items-center gap-4 min-w-0">
                    {/* Order ID */}
                    <div className="flex-shrink-0">
                        <p className="text-[10px] tracking-[0.15em] uppercase text-[#664433] mb-0.5">Order</p>
                        <p className="font-mono text-xs text-white font-semibold">
                            {String(order.id ?? "").slice(0, 12)}…
                        </p>
                    </div>

                    {/* Date */}
                    <div className="hidden sm:block flex-shrink-0">
                        <p className="text-[10px] tracking-[0.15em] uppercase text-[#664433] mb-0.5">Date</p>
                        <p className="text-xs text-[#aa8866]">{fmtDate(order.createdAt ?? order.date)}</p>
                    </div>

                    {/* Items count */}
                    <div className="hidden md:block flex-shrink-0">
                        <p className="text-[10px] tracking-[0.15em] uppercase text-[#664433] mb-0.5">Items</p>
                        <p className="text-xs text-[#aa8866]">{items.length} item{items.length !== 1 ? "s" : ""}</p>
                    </div>

                    {/* Status */}
                    <StatusBadge status={order.status} />
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    {/* Total */}
                    <div className="text-right">
                        <p className="text-[10px] tracking-[0.15em] uppercase text-[#664433] mb-0.5">Total</p>
                        <p className="heading text-base" style={gradients.brandText}>{fmt(total)}</p>
                    </div>

                    {/* Chevron */}
                    <div className="text-[#664433]">
                        {open ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                    </div>
                </div>
            </button>

            {/* ── Expanded detail ── */}
            {open && (
                <div className="border-t border-[#1e1000] px-5 py-5 flex flex-col gap-5">

                    {/* Items list */}
                    <div>
                        <p className={`${tw.label} mb-3`}>Items</p>
                        <div className="flex flex-col gap-3">
                            {items.length > 0 ? items.map((item, i) => (
                                <div key={item.id ?? i} className="flex items-center gap-3">
                                    {/* Image */}
                                    {(item.imageUrl ?? item.image) ? (
                                        <img
                                            src={item.imageUrl ?? item.image}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-lg border border-[#2a1500] flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-[#1e1000] flex items-center justify-center flex-shrink-0">
                                            <FiPackage size={16} className="text-[#2a1500]" />
                                        </div>
                                    )}
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white font-medium truncate">{item.name ?? item.productName}</p>
                                        <p className="text-xs text-[#664433] mt-0.5">
                                            {item.variant && <span>{item.variant} · </span>}
                                            Qty: {item.qty ?? item.quantity ?? 1}
                                        </p>
                                    </div>
                                    {/* Price */}
                                    <p className="text-sm font-semibold text-white flex-shrink-0">
                                        {fmt((item.price ?? 0) * (item.qty ?? item.quantity ?? 1))}
                                    </p>
                                </div>
                            )) : (
                                <p className="text-xs text-[#664433]">No item details available.</p>
                            )}
                        </div>
                    </div>

                    {/* Price breakdown + shipping address */}
                    <div className="grid md:grid-cols-2 gap-5">

                        {/* Price breakdown */}
                        <div>
                            <p className={`${tw.label} mb-3`}>Summary</p>
                            <div className="bg-[#0d0800] rounded-xl p-4 flex flex-col gap-2 border border-[#1e1000]">
                                <div className="flex justify-between text-xs text-[#664433]">
                                    <span>Subtotal</span><span className="text-[#aa8866]">{fmt(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-xs text-green-400">
                                        <span>Discount</span><span>−{fmt(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xs text-[#664433]">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? "text-green-400" : "text-[#aa8866]"}>
                                        {shipping === 0 ? "Free" : fmt(shipping)}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-[#2a1500] pt-2 mt-1">
                                    <span className="heading text-sm text-white">Total</span>
                                    <span className="heading text-base" style={gradients.brandText}>{fmt(total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping address */}
                        {order.shipping && (
                            <div>
                                <p className={`${tw.label} mb-3`}>Ship To</p>
                                <div className="bg-[#0d0800] rounded-xl p-4 border border-[#1e1000]">
                                    <p className="text-sm text-white font-medium">
                                        {order.shipping.firstName} {order.shipping.lastName}
                                    </p>
                                    <p className="text-xs text-[#664433] mt-1.5 leading-relaxed">
                                        {order.shipping.address}<br />
                                        {order.shipping.city}{order.shipping.state ? `, ${order.shipping.state}` : ""} {order.shipping.zip}<br />
                                        {order.shipping.country}
                                    </p>
                                    <p className="text-xs text-[#664433] mt-1">{order.shipping.email}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment method */}
                    {order.payment && (
                        <div>
                            <p className={`${tw.label} mb-2`}>Payment</p>
                            <p className="text-xs text-[#aa8866]">
                                {order.payment.method === "card"
                                    ? `Credit card ending in ${order.payment.last4 ?? "****"}`
                                    : order.payment.method === "paypal"
                                        ? "PayPal"
                                        : order.payment.method ?? "—"}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ── Empty state ── */
function EmptyOrders() {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.15)" }}
            >
                <FiShoppingBag size={32} className="text-[#664433]" />
            </div>
            <div className="text-center">
                <p className="heading text-2xl text-white mb-2">No orders yet</p>
                <p className="text-sm text-[#664433] max-w-xs leading-relaxed">
                    When you place an order, it will appear here so you can track its progress.
                </p>
            </div>
            <Link
                to="/"
                className="px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase text-white no-underline transition-all hover:scale-[1.02]"
                style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}
            >
                Start Shopping
            </Link>
        </div>
    );
}

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function OrdersPage() {
    usePageTitle("My Orders");
    const navigate = useNavigate();
    const { user, isLoggedIn } = useUser();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL");

    if (!isLoggedIn) { navigate("/login"); return null; }

    useEffect(() => {
        getMyOrdersApi()
            .then((data) => {
                const list = Array.isArray(data) ? data : (data?.orders ?? data?.data ?? []);
                setOrders(list);
            })
            .catch((err) => {
                setError(err.response?.data?.message ?? "Failed to load orders.");
            })
            .finally(() => setLoading(false));
    }, []);

    const STATUS_FILTERS = ["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

    const filtered = filter === "ALL"
        ? orders
        : orders.filter((o) => (o.status ?? "").toUpperCase() === filter);

    return (
        <div className="min-h-screen bg-[#0d0800]">
            <style>{keyframes}</style>

            <div className="max-w-4xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-8">
                    <p className={`${tw.labelOrange} mb-1`}>Account</p>
                    <h1 className="heading text-5xl text-white">MY ORDERS</h1>
                </div>

                {/* Filter tabs */}
                {!loading && orders.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {STATUS_FILTERS.map((s) => {
                            const count = s === "ALL" ? orders.length : orders.filter((o) => (o.status ?? "").toUpperCase() === s).length;
                            const active = filter === s;
                            return (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer border-none"
                                    style={{
                                        background: active ? gradients.brand : "#130900",
                                        color: active ? "#fff" : "#664433",
                                        border: active ? "none" : "1px solid #2a1500",
                                        boxShadow: active ? shadows.btnGlow : "none",
                                    }}
                                >
                                    {s}
                                    <span
                                        className="px-1.5 py-0.5 rounded-full text-[9px]"
                                        style={{ background: active ? "rgba(255,255,255,0.2)" : "#1e1000", color: active ? "#fff" : "#664433" }}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <LoadingSpinner size={36} color="#ff6b00" />
                        <p className="text-xs tracking-widest uppercase text-[#664433]">Loading orders…</p>
                    </div>
                ) : error ? (
                    <div className="max-w-md mx-auto mt-8">
                        <ErrorBanner message={error} />
                    </div>
                ) : orders.length === 0 ? (
                    <EmptyOrders />
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-[#664433] text-sm">No {filter.toLowerCase()} orders.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {/* Summary stats */}
                        <div className="grid grid-cols-3 gap-3 mb-2">
                            {[
                                { label: "Total Orders", value: orders.length },
                                { label: "Delivered", value: orders.filter((o) => o.status?.toUpperCase() === "DELIVERED").length },
                                { label: "Total Spent", value: fmt(orders.reduce((s, o) => s + (o.total ?? o.totalAmount ?? 0), 0)) },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-[#130900] border border-[#2a1500] rounded-xl p-4 text-center">
                                    <p className="heading text-xl text-white mb-0.5">{value}</p>
                                    <p className="text-[10px] tracking-widest uppercase text-[#664433]">{label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Order rows */}
                        {filtered.map((order) => (
                            <OrderRow key={order.id} order={order} />
                        ))}
                    </div>
                )}

                {/* Back to profile */}
                <div className="mt-8">
                    <Link
                        to="/profile"
                        className="inline-flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-[#664433] no-underline hover:text-[#ff6b00] transition-colors"
                    >
                        ← Back to profile
                    </Link>
                </div>
            </div>
        </div>
    );
}