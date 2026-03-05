import { useState } from "react";

// Props: product, onAddToCart, onViewDetail (optional)
export default function ProductCard({ product, onAddToCart, onViewDetail }) {
  const [added, setAdded]     = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleClick = () => onViewDetail?.(product);

  const fmt = (n) => `$${Number(n).toFixed(2)}`;

  const discPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      onClick={handleClick}
      className="group relative bg-[#110700] rounded-2xl overflow-hidden border cursor-pointer"
      style={{
        borderColor: hovered ? "#ff6b0044" : "#1e1000",
        boxShadow:   hovered ? "0 8px 40px rgba(255,107,0,0.1)" : "none",
        transform:   hovered ? "translateY(-4px)" : "none",
        transition:  "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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

        {/* Quick Add + Quick View overlay */}
        <div
          className="absolute inset-x-0 bottom-0 p-3 flex gap-2"
          style={{
            opacity:    hovered ? 1 : 0,
            transform:  hovered ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
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
          {onViewDetail && (
            <button
              onClick={(e) => { e.stopPropagation(); onViewDetail(product); }}
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
              style={{ background: "#1e1000", border: "1px solid #2a1500", color: "#664433" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ff6b00"; e.currentTarget.style.color = "#ff6b00"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a1500"; e.currentTarget.style.color = "#664433"; }}
              title="Quick view"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3">
        <p className="text-[10px] tracking-widest text-[#ff6b00] uppercase mb-0.5">{product.category}</p>
        <div className="flex items-start justify-between gap-2">
          <p className="text-[14px] font-semibold text-white leading-snug flex-1">{product.name}</p>
          <div className="text-right flex-shrink-0">
            <p className="heading text-[16px] text-white">{fmt(product.price)}</p>
            {product.originalPrice && (
              <p className="text-[11px] text-[#444] line-through">{fmt(product.originalPrice)}</p>
            )}
          </div>
        </div>
        <p className="text-[11px] text-[#444] mt-0.5">{product.variant}</p>
      </div>
    </div>
  );
}