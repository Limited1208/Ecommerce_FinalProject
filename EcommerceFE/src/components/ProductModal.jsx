import { useEffect, useState } from "react";

export default function ProductModal({ product, onClose, onAddToCart }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [sizeChartOpen, setSizeChartOpen] = useState(false);
    const [careOpen, setCareOpen] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (product?.sizes?.length) setSelectedSize(product.sizes[0]);
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [onClose, product]);

    if (!product) return null;

    const discount =
        product.originalPrice && product.originalPrice > product.price
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
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(28,24,20,0.6)",
                backdropFilter: "blur(6px)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#faf8f5",
                    borderRadius: "2px",
                    maxWidth: "820px",
                    width: "100%",
                    maxHeight: "90vh",
                    display: "flex",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "none",
                        border: "none",
                        fontSize: "22px",
                        cursor: "pointer",
                        color: "#2c2c2c",
                        zIndex: 10,
                        lineHeight: 1,
                    }}
                >
                    ×
                </button>

                {/* Image */}
                <div style={{ width: "44%", flexShrink: 0, background: "#ede8e1" }}>
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                </div>

                {/* Details */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "36px 32px 36px 36px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    {/* Category + badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "11px", color: "#9a8c7e", letterSpacing: "2px", textTransform: "uppercase" }}>
                            {product.category}
                        </span>
                        {product.badge && (
                            <span
                                style={{
                                    fontSize: "10px",
                                    fontWeight: 500,
                                    letterSpacing: "1px",
                                    textTransform: "uppercase",
                                    padding: "2px 8px",
                                    background: product.badge === "Sale" ? "#c0392b" : "#2c2c2c",
                                    color: "#fff",
                                    borderRadius: "2px",
                                }}
                            >
                                {product.badge}
                            </span>
                        )}
                    </div>

                    {/* Name */}
                    <h2
                        className="heading"
                        style={{ fontSize: "26px", fontWeight: 600, color: "#2c2c2c", margin: 0, lineHeight: 1.2 }}
                    >
                        {product.name}
                    </h2>

                    {/* Variant */}
                    <p style={{ fontSize: "13px", color: "#9a8c7e", margin: 0 }}>{product.variant}</p>

                    {/* Price */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {product.originalPrice && (
                            <span style={{ fontSize: "14px", color: "#b0a090", textDecoration: "line-through" }}>
                                ${product.originalPrice}
                            </span>
                        )}
                        <span
                            style={{
                                fontSize: "20px",
                                fontWeight: 600,
                                color: discount ? "#c0392b" : "#2c2c2c",
                            }}
                        >
                            ${product.price}
                        </span>
                        {discount && (
                            <span
                                style={{
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    background: "#fdf0ef",
                                    color: "#c0392b",
                                    padding: "2px 8px",
                                    borderRadius: "20px",
                                }}
                            >
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <p style={{ fontSize: "14px", color: "#5c5248", lineHeight: 1.7, margin: 0 }}>
                            {product.description}
                        </p>
                    )}

                    {/* Material */}
                    {product.material && (
                        <div>
                            <span style={{ fontSize: "11px", color: "#9a8c7e", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                                Material
                            </span>
                            <p style={{ fontSize: "14px", color: "#2c2c2c", margin: "4px 0 0 0" }}>{product.material}</p>
                        </div>
                    )}

                    {/* Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div>
                            <span style={{ fontSize: "11px", color: "#9a8c7e", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                                Size
                            </span>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        style={{
                                            padding: "6px 14px",
                                            fontSize: "13px",
                                            border: "1px solid",
                                            borderColor: selectedSize === size ? "#2c2c2c" : "#d4c9bc",
                                            background: selectedSize === size ? "#2c2c2c" : "transparent",
                                            color: selectedSize === size ? "#fff" : "#2c2c2c",
                                            cursor: "pointer",
                                            borderRadius: "2px",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size chart accordion */}
                    {product.sizeChart && (
                        <div style={{ borderTop: "1px solid #e8e0d8", paddingTop: "12px" }}>
                            <button
                                onClick={() => setSizeChartOpen(!sizeChartOpen)}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "4px 0",
                                    fontSize: "12px",
                                    color: "#2c2c2c",
                                    letterSpacing: "1.5px",
                                    textTransform: "uppercase",
                                    fontWeight: 500,
                                }}
                            >
                                Size Chart
                                <span style={{ transition: "transform 0.2s", transform: sizeChartOpen ? "rotate(180deg)" : "none" }}>
                                    ▾
                                </span>
                            </button>
                            <div
                                style={{
                                    maxHeight: sizeChartOpen ? "300px" : "0",
                                    overflow: "hidden",
                                    transition: "max-height 0.3s ease",
                                }}
                            >
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        fontSize: "13px",
                                        marginTop: "12px",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            {product.sizeChart.headers.map((h) => (
                                                <th
                                                    key={h}
                                                    style={{
                                                        textAlign: "left",
                                                        padding: "6px 8px",
                                                        background: "#ede8e1",
                                                        color: "#5c5248",
                                                        fontWeight: 500,
                                                        fontSize: "11px",
                                                        letterSpacing: "0.5px",
                                                    }}
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {product.sizeChart.rows.map((row, i) => (
                                            <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "#faf8f5" }}>
                                                {row.map((cell, j) => (
                                                    <td
                                                        key={j}
                                                        style={{
                                                            padding: "6px 8px",
                                                            color: "#2c2c2c",
                                                            borderBottom: "1px solid #ede8e1",
                                                        }}
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

                    {/* Care accordion */}
                    {careSteps.length > 0 && (
                        <div style={{ borderTop: "1px solid #e8e0d8", paddingTop: "12px" }}>
                            <button
                                onClick={() => setCareOpen(!careOpen)}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "4px 0",
                                    fontSize: "12px",
                                    color: "#2c2c2c",
                                    letterSpacing: "1.5px",
                                    textTransform: "uppercase",
                                    fontWeight: 500,
                                }}
                            >
                                Care Instructions
                                <span style={{ transition: "transform 0.2s", transform: careOpen ? "rotate(180deg)" : "none" }}>
                                    ▾
                                </span>
                            </button>
                            <div
                                style={{
                                    maxHeight: careOpen ? "300px" : "0",
                                    overflow: "hidden",
                                    transition: "max-height 0.3s ease",
                                }}
                            >
                                <ul style={{ margin: "12px 0 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
                                    {careSteps.map((step, i) => (
                                        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#5c5248" }}>
                                            <span style={{ color: "#c8a96e", flexShrink: 0, marginTop: "1px" }}>✦</span>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        style={{
                            marginTop: "8px",
                            padding: "14px",
                            background: added ? "#2e7d32" : "#2c2c2c",
                            color: "#fff",
                            border: "none",
                            fontSize: "13px",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            fontWeight: 500,
                            cursor: "pointer",
                            borderRadius: "2px",
                            transition: "background 0.3s",
                        }}
                    >
                        {added ? "Added to Cart ✓" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
}
