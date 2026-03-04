import { useState } from "react";

export default function ProductCard({ product, onAddToCart }) {
    const [added, setAdded] = useState(false);
    const [hovered, setHovered] = useState(false);

    const handleAdd = () => {
        onAddToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <div
            className="group relative bg-[#110700] rounded-2xl overflow-hidden border transition-all"
            style={{
                borderColor: hovered ? "#ff6b0044" : "#1e1000",
                boxShadow: hovered ? "0 0 32px rgba(0,229,255,0.08)" : "none",
                transform: hovered ? "translateY(-4px)" : "none",
                transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Badge */}
            {product.badge && (
                <div className="absolute top-3 left-3 z-10 bg-[#ff6b00] text-[#0d0800] text-[10px] tracking-widest uppercase px-2.5 py-1 rounded font-bold">
                    {product.badge}
                </div>
            )}

            {/* Image */}
            <div className="relative overflow-hidden bg-[#160a00] aspect-[5/6]">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-90"
                    style={{
                        transform: hovered ? "scale(1.07)" : "scale(1)",
                        transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 to-transparent" />

                {/* Quick add overlay */}
                <div
                    className="absolute inset-x-0 bottom-0 p-3"
                    style={{
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? "translateY(0)" : "translateY(10px)",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                    }}
                >
                    <button
                        onClick={handleAdd}
                        className="w-full py-2.5 rounded-lg text-xs tracking-widest uppercase font-bold transition-all"
                        style={{
                            background: added ? "#22c55e" : "#ff6b00",
                            color: "#0d0800",
                        }}
                    >
                        {added ? "Added ✓" : "Quick Add"}
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="px-4 py-3">
                <p className="text-[10px] tracking-widest text-[#ff6b00] uppercase mb-0.5">{product.category}</p>
                <div className="flex items-center justify-between">
                    <p className="text-[14px] font-semibold text-white leading-snug">{product.name}</p>
                    <p className="heading text-[16px] text-white">${product.price}</p>
                </div>
                <p className="text-[11px] text-[#444] mt-0.5">{product.variant}</p>
            </div>
        </div>
    );
}