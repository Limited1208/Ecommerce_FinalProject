import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";


function useCountdown(targetDate) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);
    const diff = Math.max(0, targetDate - now);
    return {
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
    };
}

const SALE_END = new Date("2025-12-31T23:59:59").getTime();

const SORT_OPTIONS = [
    { value: "discount",   label: "Biggest Discount" },
    { value: "price_asc",  label: "Price: Low → High" },
    { value: "price_desc", label: "Price: High → Low" },
    { value: "name",       label: "Name A–Z" },
];

export default function SalePage() {
    const context = useOutletContext() ?? {};
    const { addToCart = () => {}, openProductModal = () => {} } = context;
    const { products, loading, error } = useProducts();

    const [sort, setSort]                     = useState("discount");
    const [activeCategory, setActiveCategory] = useState("All");
    const { d, h, m, s } = useCountdown(SALE_END);

    const saleProducts = useMemo(
        () => products.filter((p) => p.originalPrice && p.originalPrice > p.price),
        [products],
    );

    const categories = useMemo(
        () => ["All", ...new Set(saleProducts.map((p) => p.category))],
        [saleProducts],
    );

    const filtered = useMemo(() => {
        const base =
            activeCategory === "All"
                ? saleProducts
                : saleProducts.filter((p) => p.category === activeCategory);
        return [...base].sort((a, b) => {
            if (sort === "discount")
                return (b.originalPrice - b.price) / b.originalPrice - (a.originalPrice - a.price) / a.originalPrice;
            if (sort === "price_asc")  return a.price - b.price;
            if (sort === "price_desc") return b.price - a.price;
            return a.name.localeCompare(b.name);
        });
    }, [saleProducts, activeCategory, sort]);

    if (loading) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
                <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    border: "2px solid #ff6b00", borderTopColor: "transparent",
                    margin: "0 auto 16px",
                    animation: "spin 0.8s linear infinite",
                }} />
                <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#664433" }}>
                    Loading…
                </p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
    );

    if (error) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
            <div>
                <p style={{ fontSize: 40, marginBottom: 12 }}>⚠️</p>
                <p className="heading" style={{ fontSize: 22, color: "#fff", marginBottom: 8 }}>Failed to load products</p>
                <p style={{ fontSize: 13, color: "#664433" }}>Please try again later.</p>
            </div>
        </div>
    );

    const maxDiscount = saleProducts.length > 0
        ? Math.round(Math.max(...saleProducts.map((p) => ((p.originalPrice - p.price) / p.originalPrice) * 100)))
        : 0;
    const maxSavings = saleProducts.length > 0
        ? Math.max(...saleProducts.map((p) => p.originalPrice - p.price))
        : 0;

    const fmt = (n) => `$${Number(n).toFixed(2)}`;

    return (
        <>
            <style>{`
                @keyframes slideUp   { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
                @keyframes pulseGlow { 0%,100% { box-shadow:0 0 16px rgba(255,0,64,0.4) } 50% { box-shadow:0 0 40px rgba(255,0,64,0.8) } }
                @keyframes ticker    { from { transform:translateX(0) } to { transform:translateX(-50%) } }
                .fade-up { animation: slideUp 0.55s ease both; }
            `}</style>

            <div style={{
                background: "linear-gradient(135deg, #1a0000 0%, #0d0800 55%, #1a0005 100%)",
                borderBottom: "1px solid #2a0010",
                position: "relative",
                overflow: "hidden",
                minHeight: 340,
            }}>

                <div style={{
                    position: "absolute", top: -100, right: -100, width: 400, height: 400,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,0,64,0.18) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />
                <div style={{
                    position: "absolute", bottom: -80, left: -80, width: 280, height: 280,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />

                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 52px", position: "relative", zIndex: 1 }}>
                    <div className="fade-up">
                        <span style={{
                            fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase",
                            color: "#ff0040", fontWeight: 700,
                            background: "rgba(255,0,64,0.1)", border: "1px solid rgba(255,0,64,0.3)",
                            padding: "5px 14px", borderRadius: 99,
                        }}>
                            🔥 Limited Time Offer
                        </span>
                    </div>

                    <h1 className="heading fade-up" style={{
                        fontSize: "clamp(56px, 9vw, 96px)",
                        lineHeight: 0.92, color: "#fff",
                        margin: "20px 0 16px",
                        animationDelay: "0.05s",
                    }}>
                        SEASON<br />
                        <span style={{
                            background: "linear-gradient(90deg,#ff6b00,#ff0040)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>
                            SALE
                        </span>
                    </h1>

                    <p className="fade-up" style={{
                        fontSize: 15, color: "#aa8866",
                        maxWidth: 420, lineHeight: 1.7, marginBottom: 40,
                        animationDelay: "0.1s",
                    }}>
                        Up to {maxDiscount}% off selected gear, footwear &amp; apparel.
                        These deals won't last — grab them while you can.
                    </p>

                    <div className="fade-up" style={{ animationDelay: "0.18s" }}>
                        <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#664433", marginBottom: 12 }}>
                            Sale ends in
                        </p>
                        <div style={{ display: "flex", gap: 12 }}>
                            {[["Days", d], ["Hrs", h], ["Min", m], ["Sec", s]].map(([label, val]) => (
                                <div key={label} style={{
                                    background: "#130900",
                                    border: "1px solid #2a1500",
                                    borderRadius: 12,
                                    padding: "14px 20px",
                                    textAlign: "center",
                                    minWidth: 72,
                                }}>
                                    <p className="heading" style={{
                                        fontSize: 34, lineHeight: 1,
                                        background: "linear-gradient(180deg,#ff6b00,#ff0040)",
                                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                    }}>
                                        {String(val).padStart(2, "0")}
                                    </p>
                                    <p style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#664433", marginTop: 5 }}>
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                background: "linear-gradient(90deg,#ff6b00,#ff0040)",
                padding: "9px 0", overflow: "hidden", whiteSpace: "nowrap",
            }}>
                <div style={{ display: "inline-flex", animation: "ticker 24s linear infinite" }}>
                    {Array(10).fill(`🔥 SALE ON NOW · UP TO ${maxDiscount}% OFF · FREE SHIPPING OVER $50 · `).map((t, i) => (
                        <span key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: "#fff", paddingRight: 60 }}>
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            <section style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px" }}>

                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: "7px 18px", borderRadius: 99,
                                    fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                                    cursor: "pointer", transition: "all 0.18s",
                                    background: activeCategory === cat ? "linear-gradient(135deg,#ff6b00,#ff0040)" : "#130900",
                                    color:  activeCategory === cat ? "#fff" : "#664433",
                                    border: activeCategory === cat ? "1px solid transparent" : "1px solid #2a1500",
                                    boxShadow: activeCategory === cat ? "0 4px 16px rgba(255,107,0,0.3)" : "none",
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <p style={{ fontSize: 12, color: "#664433" }}>
                            <span className="heading" style={{ color: "#ff6b00", fontSize: 18 }}>{filtered.length}</span> items
                        </p>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            style={{
                                background: "#130900", border: "1px solid #2a1500",
                                color: "#aa8866", fontSize: 11,
                                padding: "8px 12px", borderRadius: 8,
                                cursor: "pointer", outline: "none",
                            }}
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {saleProducts.length > 0 && (
                    <div style={{
                        background: "linear-gradient(135deg,#130900,#1a0005)",
                        border: "1px solid #2a1500",
                        borderRadius: 14,
                        padding: "18px 28px",
                        marginBottom: 36,
                        display: "flex", flexWrap: "wrap", gap: 36,
                    }}>
                        {[
                            { label: "Items on Sale", value: saleProducts.length,      color: "#ff6b00" },
                            { label: "Max Discount",  value: `${maxDiscount}%`,         color: "#ff0040" },
                            { label: "Max Savings",   value: fmt(maxSavings),            color: "#ff6b00" },
                        ].map(({ label, value, color }) => (
                            <div key={label}>
                                <p className="heading" style={{ fontSize: 26, color, marginBottom: 2 }}>{value}</p>
                                <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#664433" }}>{label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {filtered.length > 0 ? (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                        gap: 20,
                    }}>
                        {filtered.map((product, i) => {
                            const savings = product.originalPrice - product.price;
                            const discPct = Math.round((savings / product.originalPrice) * 100);
                            return (
                                <div
                                    key={product.id}
                                    className="fade-up"
                                    style={{ animationDelay: `${i * 0.04}s`, position: "relative" }}
                                >
                                    <div style={{
                                        position: "absolute", top: 12, right: 12, zIndex: 10,
                                        background: "linear-gradient(135deg,#ff0040,#ff6b00)",
                                        color: "#fff", fontSize: 11, fontWeight: 800,
                                        padding: "4px 10px", borderRadius: 99,
                                        boxShadow: "0 4px 12px rgba(255,0,64,0.5)",
                                        animation: "pulseGlow 2s ease-in-out infinite",
                                    }}>
                                        -{discPct}%
                                    </div>

                                    <ProductCard
                                        product={product}
                                        onAddToCart={addToCart}
                                        onViewDetail={openProductModal}
                                    />

                                    <div style={{
                                        marginTop: 8, textAlign: "center",
                                        fontSize: 11, color: "#ff6b00", fontWeight: 600,
                                    }}>
                                        You save {fmt(savings)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ padding: "80px 0", textAlign: "center" }}>
                        <p style={{ fontSize: 48, marginBottom: 16 }}>🏷️</p>
                        <p className="heading" style={{ fontSize: 24, color: "#fff", marginBottom: 10 }}>No sale items found</p>
                        <p style={{ fontSize: 13, color: "#664433" }}>Check back soon — new deals drop regularly.</p>
                    </div>
                )}
            </section>

            {filtered.length > 0 && (
                <div style={{
                    background: "linear-gradient(135deg,#1a0000,#0d0800,#1a0005)",
                    borderTop: "1px solid #2a0010",
                    padding: "64px 24px", textAlign: "center",
                }}>
                    <p style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#ff0040", marginBottom: 14 }}>
                        🔥 Don't miss out
                    </p>
                    <h2 className="heading" style={{ fontSize: "clamp(28px,5vw,52px)", color: "#fff", marginBottom: 14 }}>
                        Free Shipping on Orders Over{" "}
                        <span style={{
                            background: "linear-gradient(90deg,#ff6b00,#ff0040)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>
                            $50
                        </span>
                    </h2>
                    <p style={{ fontSize: 14, color: "#664433", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
                        Stack your sale picks to hit the threshold and get free delivery straight to your door.
                    </p>
                </div>
            )}
        </>
    );
}