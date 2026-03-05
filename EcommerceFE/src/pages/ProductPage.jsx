import { useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { PRODUCTS } from "../data/constants";

function Accordion({ title, children }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ borderTop: "1px solid #1e1000" }}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between py-4 text-sm text-white transition-colors"
                style={{ color: open ? "#ff6b00" : "#664433" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#ff6b00"}
                onMouseLeave={(e) => e.currentTarget.style.color = open ? "#ff6b00" : "#664433"}
            >
                <span className="tracking-widest uppercase text-xs font-semibold">{title}</span>
                <span
                    className="text-lg leading-none transition-transform duration-300"
                    style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)", color: "#ff6b00" }}
                >
                    +
                </span>
            </button>
            <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
                <div className="pb-4">{children}</div>
            </div>
        </div>
    );
}

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useOutletContext();

    const product = PRODUCTS.find((p) => p.id === Number(id));
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? null);
    const [added, setAdded] = useState(false);

    /* ── Not found ── */
    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4" style={{ background: "#0d0800" }}>
                <p className="heading text-4xl text-white">PRODUCT NOT FOUND</p>
                <p className="text-sm" style={{ color: "#664433" }}>The item you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-2 text-xs tracking-widest uppercase font-bold px-6 py-2.5 rounded-lg transition-all text-white"
                    style={{ border: "1px solid #ff6b0044", color: "#ff6b00" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg,#ff6b00,#ff0040)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.border = "1px solid transparent"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ff6b00"; e.currentTarget.style.border = "1px solid #ff6b0044"; }}
                >
                    ← Back to Home
                </button>
            </div>
        );
    }

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    const handleAddToCart = () => {
        const colorPart = product.variant?.split(" / ")[0] ?? product.name;
        const updatedVariant = selectedSize ? `${colorPart} / ${selectedSize}` : product.variant;
        addToCart({ ...product, variant: updatedVariant, selectedSize });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');
                .heading { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
                @keyframes fadeIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
                .fade-in { animation: fadeIn 0.45s ease both; }
                @keyframes pulse-fire { 0%,100%{box-shadow:0 0 8px #ff6b0055,0 0 16px #ff000033} 50%{box-shadow:0 0 20px #ff6b00aa,0 0 40px #ff000055} }
                .neon-btn { animation: pulse-fire 2.5s ease-in-out infinite; }
            `}</style>

            <div className="min-h-screen" style={{ background: "#0d0800" }}>

                {/* Background grid */}
                <div className="fixed inset-0 opacity-[0.025] pointer-events-none" style={{
                    backgroundImage: "linear-gradient(#ff6b00 1px, transparent 1px), linear-gradient(90deg, #ff6b00 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }} />

                <div className="relative max-w-6xl mx-auto px-6 py-10">

                    {/* ── Back button ── */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-xs tracking-widest uppercase font-semibold mb-8 transition-colors"
                        style={{ color: "#664433" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#ff6b00"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#664433"}
                    >
                        ← Back
                    </button>

                    {/* ── Two-column layout ── */}
                    <div className="grid md:grid-cols-[45%_55%] gap-10 items-start">

                        {/* ── LEFT: Image ── */}
                        <div className="md:sticky md:top-24 fade-in">
                            <div
                                className="relative rounded-2xl overflow-hidden aspect-[4/5]"
                                style={{ background: "#110700", border: "1px solid #1e1000" }}
                            >
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90" />

                                {/* Fire gradient overlay at bottom */}
                                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0d080088, transparent 50%)" }} />

                                {/* Badge */}
                                {product.badge && (
                                    <div
                                        className="absolute top-4 left-4 text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded font-bold"
                                        style={{ background: product.badge === "Sale" ? "linear-gradient(135deg,#ff0040,#cc0030)" : "linear-gradient(135deg,#ff6b00,#ff0040)" }}
                                    >
                                        {product.badge}
                                    </div>
                                )}

                                {/* Discount */}
                                {discount && (
                                    <div className="absolute top-4 right-4 text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded font-bold"
                                        style={{ background: "linear-gradient(135deg,#ff0040,#cc0030)" }}
                                    >
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

                            {/* Label line */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-px w-6 bg-[#ff6b00]" />
                                <p className="text-xs tracking-[0.3em] uppercase text-[#ff6b00]">{product.category}</p>
                            </div>

                            {/* Name */}
                            <h1 className="heading text-5xl text-white leading-none mb-2">{product.name}</h1>
                            <p className="text-sm mb-5" style={{ color: "#664433" }}>{product.variant}</p>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-6">
                                {product.originalPrice && (
                                    <span className="text-lg line-through" style={{ color: "#2a1500" }}>${product.originalPrice}</span>
                                )}
                                <span className="heading text-4xl" style={{ color: product.originalPrice ? "#ff0040" : "#ff6b00" }}>
                                    ${product.price}
                                </span>
                                {discount && (
                                    <span className="text-xs tracking-widest uppercase px-2.5 py-1 rounded font-bold" style={{ background: "#1e0a00", color: "#ff0040", border: "1px solid #ff004033" }}>
                                        Save {discount}%
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-sm leading-relaxed mb-6" style={{ color: "#664433" }}>{product.description}</p>

                            {/* Material */}
                            <div className="flex items-start gap-3 text-sm mb-6 p-4 rounded-xl" style={{ background: "#110700", border: "1px solid #1e1000" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b00" strokeWidth="1.5" className="mt-0.5 flex-shrink-0">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                <div>
                                    <p className="text-[10px] tracking-widest uppercase text-[#ff6b00] mb-0.5">Material</p>
                                    <p className="text-white">{product.material}</p>
                                </div>
                            </div>

                            {/* Size selector */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs tracking-widest uppercase font-semibold" style={{ color: "#664433" }}>Size</p>
                                        {selectedSize && (
                                            <p className="text-xs tracking-wide text-[#ff6b00]">Selected: {selectedSize}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className="px-4 py-2 rounded-lg text-xs tracking-widest uppercase font-semibold transition-all"
                                                style={{
                                                    background: selectedSize === size ? "linear-gradient(135deg,#ff6b00,#ff0040)" : "#1a0e00",
                                                    color: selectedSize === size ? "#fff" : "#664433",
                                                    border: selectedSize === size ? "1px solid transparent" : "1px solid #2a1500",
                                                }}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                className="neon-btn w-full py-4 rounded-lg text-sm tracking-widest uppercase font-bold transition-all mb-4 text-white"
                                style={{
                                    background: added
                                        ? "linear-gradient(135deg,#22c55e,#16a34a)"
                                        : "linear-gradient(135deg,#ff6b00,#ff0040)",
                                    boxShadow: added ? "0 0 20px #22c55e55" : undefined,
                                }}
                            >
                                {added ? "Added to Cart ✓" : "Add to Cart 🔥"}
                            </button>

                            {/* Trust badges */}
                            <p className="text-center text-xs tracking-wide mb-6" style={{ color: "#2a1500" }}>
                                Free returns · Secure checkout · Free shipping over $300
                            </p>

                            {/* ── Accordions ── */}
                            <div style={{ borderBottom: "1px solid #1e1000" }}>

                                {product.sizeChart && (
                                    <Accordion title="Size Chart">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr style={{ borderBottom: "1px solid #1e1000" }}>
                                                        {product.sizeChart.headers.map((h) => (
                                                            <th key={h} className="text-left py-2 pr-4 text-[10px] tracking-widest uppercase font-normal" style={{ color: "#664433" }}>
                                                                {h}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {product.sizeChart.rows.map((row, i) => (
                                                        <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "#110700", borderBottom: "1px solid #1e1000" }}>
                                                            {row.map((cell, j) => (
                                                                <td key={j} className="py-2.5 pr-4" style={{ color: j === 0 ? "#ff6b00" : "#664433", fontWeight: j === 0 ? 600 : 400 }}>
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

                                {product.care && (
                                    <Accordion title="Care Instructions">
                                        <ul className="space-y-2">
                                            {product.care.split(" · ").map((instruction, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#664433" }}>
                                                    <span className="text-[#ff6b00] mt-0.5 flex-shrink-0">·</span>
                                                    {instruction}
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