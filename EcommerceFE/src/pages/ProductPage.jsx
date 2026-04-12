import { useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { usePageTitle } from "../hooks/usePageTitle";
import Accordion from "../components/Accordion";
import LoadingSpinner from "../components/LoadingSpinner";
import { gradients, shadows, tw } from "../assets/theme";

export default function ProductPage() {
    const { id }       = useParams();
    const navigate     = useNavigate();
    const context      = useOutletContext() ?? {};
    const { onAddToCart, addToCart } = context;
    const handleCartAdd = onAddToCart ?? addToCart;

    const { products, loading, error } = useProducts();

    // ── Find product by id from URL
    const product = products.find((p) => String(p.id) === String(id));

    usePageTitle(product?.name ?? "Product");

    const [selectedSize, setSelectedSize] = useState(null);
    const [added, setAdded]               = useState(false);

    const fmt = (n) => `$${Number(n ?? 0).toFixed(2)}`;

    const discount = product?.originPrice && product.originPrice > product.price
        ? Math.round(((product.originPrice - product.price) / product.originPrice) * 100)
        : product?.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    const handleAddToCart = () => {
        if (!product) return;
        const colorPart      = product.variant?.split(" / ")[0] ?? product.name;
        const updatedVariant = selectedSize ? `${colorPart} / ${selectedSize}` : product.variant;
        handleCartAdd?.({ ...product, variant: updatedVariant, selectedSize });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#0d0800]">
                <LoadingSpinner size={36} color="#ff6b00" />
                <p className="text-xs tracking-widest uppercase text-[#664433]">Loading product…</p>
            </div>
        );
    }

    /* ── Error ── */
    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 bg-[#0d0800]">
                <p className="text-sm text-[#ff0040]">{error}</p>
                <button onClick={() => navigate(-1)} className={`${tw.btnGhost} text-xs px-5 py-2`}>← Go back</button>
            </div>
        );
    }

    /* ── Not found ── */
    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#0d0800]">
                <p className="heading text-4xl text-white">PRODUCT NOT FOUND</p>
                <p className="text-sm text-[#664433]">The item you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-2 text-xs tracking-widest uppercase font-bold px-6 py-2.5 rounded-lg text-[#ff6b00] border border-[#ff6b0044] bg-transparent hover:bg-[#ff6b00] hover:text-white transition-all cursor-pointer"
                >
                    ← Back to Home
                </button>
            </div>
        );
    }

    const careSteps = product.care ? product.care.split(" · ") : [];
    const originPrice = product.originPrice ?? product.originalPrice;

    return (
        <>
            <style>{`
                @keyframes fadeIn  { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
                @keyframes pulseFire { 0%,100%{box-shadow:0 0 8px #ff6b0055,0 0 16px #ff000033} 50%{box-shadow:0 0 20px #ff6b00aa,0 0 40px #ff000055} }
                .fade-in  { animation: fadeIn 0.45s ease both; }
                .neon-btn { animation: pulseFire 2.5s ease-in-out infinite; }
            `}</style>

            <div className="min-h-screen bg-[#0d0800]">

                {/* Subtle grid bg */}
                <div className="fixed inset-0 opacity-[0.025] pointer-events-none" style={{
                    backgroundImage: "linear-gradient(#ff6b00 1px,transparent 1px),linear-gradient(90deg,#ff6b00 1px,transparent 1px)",
                    backgroundSize: "60px 60px",
                }} />

                <div className="relative max-w-6xl mx-auto px-6 py-10">

                    {/* Back */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-xs tracking-widest uppercase font-semibold mb-8 transition-colors text-[#664433] hover:text-[#ff6b00] bg-transparent border-none cursor-pointer p-0"
                    >
                        ← Back
                    </button>

                    <div className="grid md:grid-cols-[45%_55%] gap-10 items-start">

                        {/* ── LEFT: Image ── */}
                        <div className="md:sticky md:top-24 fade-in">
                            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#110700] border border-[#1e1000]">
                                <img
                                    src={product.imageUrl ?? product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0" style={{ background: "linear-gradient(to top,#0d080088,transparent 50%)" }} />

                                {/* Badge */}
                                {product.badge && (
                                    <div
                                        className="absolute top-4 left-4 text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded font-bold"
                                        style={{ background: product.badge === "Sale" ? "linear-gradient(135deg,#ff0040,#cc0030)" : gradients.brand }}
                                    >
                                        {product.badge}
                                    </div>
                                )}

                                {/* Discount */}
                                {discount && (
                                    <div className="absolute top-4 right-4 text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded font-bold"
                                        style={{ background: "linear-gradient(135deg,#ff0040,#cc0030)" }}>
                                        −{discount}%
                                    </div>
                                )}

                                {/* Corner accents */}
                                <div className="absolute bottom-4 left-4 w-8 h-8 opacity-40" style={{ borderLeft: "2px solid #ff6b00", borderBottom: "2px solid #ff6b00" }} />
                                <div className="absolute top-4 right-14 w-6 h-6 opacity-20" style={{ borderRight: "2px solid #ff0040", borderTop: "2px solid #ff0040" }} />
                            </div>
                        </div>

                        {/* ── RIGHT: Details ── */}
                        <div className="fade-in" style={{ animationDelay: "0.08s" }}>

                            {/* Category label */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-px w-6 bg-[#ff6b00]" />
                                <p className="text-xs tracking-[0.3em] uppercase text-[#ff6b00]">
                                    {product.category ?? ""}
                                </p>
                            </div>

                            {/* Name + variant */}
                            <h1 className="heading text-5xl text-white leading-none mb-2">{product.name}</h1>
                            {product.variant && (
                                <p className="text-sm mb-5 text-[#664433]">{product.variant}</p>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-6">
                                {originPrice && (
                                    <span className="text-lg line-through text-[#2a1500]">{fmt(originPrice)}</span>
                                )}
                                <span className="heading text-4xl" style={{ color: discount ? "#ff0040" : "#ff6b00" }}>
                                    {fmt(product.price)}
                                </span>
                                {discount && (
                                    <span className="text-xs tracking-widest uppercase px-2.5 py-1 rounded font-bold bg-[#1e0a00] text-[#ff0040] border border-[#ff004033]">
                                        Save {discount}%
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            {product.description && (
                                <p className="text-sm leading-relaxed mb-6 text-[#664433]">{product.description}</p>
                            )}

                            {/* Material */}
                            {product.material && (
                                <div className="flex items-start gap-3 text-sm mb-6 p-4 rounded-xl bg-[#110700] border border-[#1e1000]">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b00" strokeWidth="1.5" className="mt-0.5 flex-shrink-0">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                    <div>
                                        <p className="text-[10px] tracking-widest uppercase text-[#ff6b00] mb-0.5">Material</p>
                                        <p className="text-white">{product.material}</p>
                                    </div>
                                </div>
                            )}

                            {/* Size selector */}
                            {product.sizes?.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className={tw.label}>Size</p>
                                        {selectedSize && (
                                            <p className="text-xs text-[#ff6b00]">Selected: {selectedSize}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size) => {
                                            const active = selectedSize === size;
                                            return (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className="px-4 py-2 rounded-lg text-xs tracking-widest uppercase font-semibold transition-all cursor-pointer border-none"
                                                    style={{
                                                        background: active ? gradients.brand : "#1a0e00",
                                                        color:      active ? "#fff"          : "#664433",
                                                        border:     active ? "1px solid transparent" : "1px solid #2a1500",
                                                    }}
                                                >
                                                    {size}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                className="neon-btn w-full py-4 rounded-xl text-sm tracking-widest uppercase font-bold transition-all mb-4 text-white border-none cursor-pointer"
                                style={{
                                    background: added ? "linear-gradient(135deg,#22c55e,#16a34a)" : gradients.brand,
                                    boxShadow:  added ? "0 0 20px #22c55e55" : shadows.btnGlow,
                                }}
                            >
                                {added ? "Added to Cart ✓" : "Add to Cart 🔥"}
                            </button>

                            <p className="text-center text-xs tracking-wide mb-6 text-[#2a1500]">
                                Free returns · Secure checkout · Free shipping over $300
                            </p>

                            {/* Accordions */}
                            <div className="border-b border-[#1e1000]">
                                {product.sizeChart && (
                                    <Accordion title="Size Chart">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="border-b border-[#1e1000]">
                                                        {product.sizeChart.headers.map((h) => (
                                                            <th key={h} className="text-left py-2 pr-4 text-[10px] tracking-widest uppercase font-normal text-[#664433]">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {product.sizeChart.rows.map((row, i) => (
                                                        <tr key={i} className="border-b border-[#1e1000]" style={{ background: i % 2 ? "#110700" : "transparent" }}>
                                                            {row.map((cell, j) => (
                                                                <td key={j} className="py-2.5 pr-4"
                                                                    style={{ color: j === 0 ? "#ff6b00" : "#664433", fontWeight: j === 0 ? 600 : 400 }}>
                                                                    {cell}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Accordion>
                                )}

                                {careSteps.length > 0 && (
                                    <Accordion title="Care Instructions">
                                        <ul className="space-y-2">
                                            {careSteps.map((step, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-[#664433]">
                                                    <span className="text-[#ff6b00] mt-0.5 flex-shrink-0">·</span>
                                                    {step}
                                                </li>
                                            ))}
                                        </ul>
                                    </Accordion>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}