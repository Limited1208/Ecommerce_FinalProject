import { useEffect, useState } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import { gradients, shadows, tw } from "../styles/theme";

export default function ProductModal({ product, onClose, onAddToCart }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [sizeChartOpen, setSizeChartOpen] = useState(false);
    const [careOpen, setCareOpen] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (product?.sizes?.length) setSelectedSize(product.sizes[0]);
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [onClose, product]);

    if (!product) return null;

    const fmt = (n) => `$${Number(n).toFixed(2)}`;

    const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    const careSteps = product.care ? product.care.split(" · ") : [];

    const handleAddToCart = () => {
        const colorPart = product.variant?.split(" / ")[0] ?? product.name;
        const updatedVariant = selectedSize ? `${colorPart} / ${selectedSize}` : product.variant;
        onAddToCart({ ...product, variant: updatedVariant, selectedSize });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <>
            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.96) translateY(12px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0); }
                }
                .modal-card { animation: modalIn 0.28s cubic-bezier(0.22,1,0.36,1) both; }
                .accordion-body { transition: max-height 0.3s ease; overflow: hidden; }
            `}</style>

            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
                onClick={onClose}
            >
                {/* Card */}
                <div
                    className="modal-card relative bg-[#130900] border border-[#2a1500] rounded-2xl w-full max-w-[820px] max-h-[90vh] flex overflow-hidden"
                    style={{ boxShadow: shadows.modal }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#1e1000] border border-[#2a1500] text-[#664433] hover:text-white hover:border-[#ff6b00] transition-all"
                    >
                        <FiX size={14} />
                    </button>

                    {/* ── Image ── */}
                    <div className="w-[44%] flex-shrink-0 bg-[#0d0800]">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover block"
                        />
                    </div>

                    {/* ── Details ── */}
                    <div className="flex-1 overflow-y-auto px-9 py-9 flex flex-col gap-4">

                        {/* Category + badge */}
                        <div className="flex items-center gap-2.5">
                            <span className={tw.label}>{product.category}</span>
                            {product.badge && (
                                <span
                                    className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded text-white"
                                    style={{
                                        background: product.badge === "Sale" ? "#ff0040"
                                            : product.badge === "New" ? "#ff6b00"
                                                : "#2a1500",
                                    }}
                                >
                                    {product.badge}
                                </span>
                            )}
                        </div>

                        {/* Name */}
                        <h2 className="heading text-[26px] text-white leading-tight m-0">
                            {product.name}
                        </h2>

                        {/* Variant */}
                        <p className="text-[13px] text-[#664433] m-0">{product.variant}</p>

                        {/* Price */}
                        <div className="flex items-center gap-2.5">
                            {product.originalPrice && (
                                <span className="text-sm text-[#664433] line-through">
                                    {fmt(product.originalPrice)}
                                </span>
                            )}
                            <span
                                className="text-xl font-semibold"
                                style={{ color: discount ? "#ff0040" : "#fff" }}
                            >
                                {fmt(product.price)}
                            </span>
                            {discount && (
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#ff004015] text-[#ff0040]">
                                    -{discount}%
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-sm text-[#aa8866] leading-[1.7] m-0">
                                {product.description}
                            </p>
                        )}

                        {/* Material */}
                        {product.material && (
                            <div>
                                <span className={tw.label}>Material</span>
                                <p className="text-sm text-white mt-1 mb-0">{product.material}</p>
                            </div>
                        )}

                        {/* Size picker */}
                        {product.sizes?.length > 0 && (
                            <div>
                                <span className={tw.label}>
                                    Size
                                    {selectedSize && (
                                        <span className="text-[#ff6b00] ml-2 normal-case tracking-normal">
                                            — {selectedSize}
                                        </span>
                                    )}
                                </span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {product.sizes.map((size) => {
                                        const active = selectedSize === size;
                                        return (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all"
                                                style={{
                                                    background: active ? "linear-gradient(135deg,#ff6b00,#ff0040)" : "#1e1000",
                                                    color: active ? "#fff" : "#664433",
                                                    border: active ? "1px solid transparent" : "1px solid #2a1500",
                                                }}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── Size chart accordion ── */}
                        {product.sizeChart && (
                            <div className="border-t border-[#1e1000] pt-3">
                                <button
                                    onClick={() => setSizeChartOpen((v) => !v)}
                                    className="w-full flex justify-between items-center bg-transparent border-none cursor-pointer py-1 text-[11px] tracking-[0.15em] uppercase font-semibold text-[#aa8866] hover:text-white transition-colors"
                                >
                                    Size Chart
                                    <FiChevronDown
                                        size={14}
                                        className="transition-transform duration-200 text-[#664433]"
                                        style={{ transform: sizeChartOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                    />
                                </button>
                                <div
                                    className="accordion-body"
                                    style={{ maxHeight: sizeChartOpen ? "300px" : "0" }}
                                >
                                    <table className="w-full border-collapse text-xs mt-3">
                                        <thead>
                                            <tr>
                                                {product.sizeChart.headers.map((h) => (
                                                    <th
                                                        key={h}
                                                        className="text-left px-2 py-1.5 text-[11px] font-medium text-[#664433] tracking-wide bg-[#1e1000]"
                                                    >
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product.sizeChart.rows.map((row, i) => (
                                                <tr
                                                    key={i}
                                                    className={i % 2 === 0 ? "bg-transparent" : "bg-[#110700]"}
                                                >
                                                    {row.map((cell, j) => (
                                                        <td
                                                            key={j}
                                                            className="px-2 py-1.5 text-[#aa8866] border-b border-[#1e1000]"
                                                        >
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ── Care instructions accordion ── */}
                        {careSteps.length > 0 && (
                            <div className="border-t border-[#1e1000] pt-3">
                                <button
                                    onClick={() => setCareOpen((v) => !v)}
                                    className="w-full flex justify-between items-center bg-transparent border-none cursor-pointer py-1 text-[11px] tracking-[0.15em] uppercase font-semibold text-[#aa8866] hover:text-white transition-colors"
                                >
                                    Care Instructions
                                    <FiChevronDown
                                        size={14}
                                        className="transition-transform duration-200 text-[#664433]"
                                        style={{ transform: careOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                    />
                                </button>
                                <div
                                    className="accordion-body"
                                    style={{ maxHeight: careOpen ? "300px" : "0" }}
                                >
                                    <ul className="mt-3 p-0 list-none flex flex-col gap-1.5">
                                        {careSteps.map((step, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-[#aa8866]">
                                                <span className="text-[#ff6b00] flex-shrink-0 mt-px">✦</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* ── Add to Cart ── */}
                        <button
                            onClick={handleAddToCart}
                            className="mt-2 py-3.5 rounded-xl border-none text-sm tracking-[0.12em] uppercase font-bold text-white cursor-pointer transition-all hover:scale-[1.02]"
                            style={{
                                background: added ? "#22c55e" : gradients.brand,
                                boxShadow: added ? "none" : shadows.btnGlow,
                            }}
                        >
                            {added ? "Added to Cart ✓" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}