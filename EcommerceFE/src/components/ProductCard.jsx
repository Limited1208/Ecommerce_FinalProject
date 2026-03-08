import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, onAddToCart }) {
  const [added, setAdded]     = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate              = useNavigate();

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const goToDetail = () => navigate(`/product/${product.id}`);

  const fmt     = (n) => `$${Number(n).toFixed(2)}`;
  const discPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="group relative bg-[#110700] rounded-2xl overflow-hidden cursor-pointer border"
      style={{
        borderColor: hovered ? "#ff6b0044" : "#1e1000",
        boxShadow:   hovered ? "0 8px 40px rgba(255,107,0,0.1)" : "none",
        transform:   hovered ? "translateY(-4px)" : "none",
        transition:  "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={goToDetail}
    >
      {/* Badge */}
      {product.badge && (
        <div
          className="absolute top-3 left-3 z-10 text-[10px] tracking-widest uppercase px-2.5 py-1 rounded font-bold"
          style={{
            background: product.badge === "Sale" ? "#ff0040"
                      : product.badge === "New"  ? "#ff6b00"
                      : "#2a1500",
            color: "#fff",
          }}
        >
          {product.badge}
        </div>
      )}

      {/* Discount % badge (when no other badge) */}
      {discPct && !product.badge && (
        <div
          className="absolute top-3 right-3 z-10 text-[10px] tracking-widest uppercase px-2.5 py-1 rounded font-bold"
          style={{ background: "#ff0040", color: "#fff" }}
        >
          -{discPct}%
        </div>
      )}

      {/* Image */}
      <div className="relative overflow-hidden bg-[#160a00] aspect-[5/6]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover opacity-90"
          style={{
            transform:  hovered ? "scale(1.07)" : "scale(1)",
            transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0800]/80 to-transparent" />

        {/* Hover overlay — Details + Quick Add */}
        <div
          className="absolute inset-x-0 bottom-0 p-3 flex gap-2"
          style={{
            opacity:    hovered ? 1 : 0,
            transform:  hovered ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {/* Details */}
          <button
            onClick={(e) => { e.stopPropagation(); goToDetail(); }}
            className="flex-1 py-2.5 rounded-lg text-xs tracking-widest uppercase font-bold transition-all"
            style={{
              background: "rgba(13,8,0,0.85)",
              color: "#ff6b00",
              border: "1px solid #ff6b0044",
              backdropFilter: "blur(4px)",
            }}
          >
            Details
          </button>

          {/* Quick Add */}
          <button
            onClick={handleAdd}
            className="flex-1 py-2.5 rounded-lg text-xs tracking-widest uppercase font-bold transition-all"
            style={{
              background: added ? "#22c55e" : "linear-gradient(135deg,#ff6b00,#ff0040)",
              color: "#fff",
              boxShadow: added ? "none" : "0 4px 16px rgba(255,107,0,0.4)",
            }}
          >
            {added ? "Added ✓" : "Quick Add"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3">
        <p className="text-[10px] tracking-widest text-[#ff6b00] uppercase mb-0.5">
          {product.category}
        </p>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[14px] font-semibold text-white leading-snug flex-1">
            {product.name}
          </p>
          <div className="text-right flex-shrink-0">
            {product.originalPrice && (
              <p className="text-[11px] text-[#444] line-through leading-none mb-0.5">
                {fmt(product.originalPrice)}
              </p>
            )}
            <p
              className="heading text-[16px] leading-none"
              style={{ color: product.originalPrice ? "#ff0040" : "#fff" }}
            >
              {fmt(product.price)}
            </p>
          </div>
        </div>
        <p className="text-[11px] text-[#444] mt-0.5">{product.variant}</p>
      </div>
    </div>
  );
}