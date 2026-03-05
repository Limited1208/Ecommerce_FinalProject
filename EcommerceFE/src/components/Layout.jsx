import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartPanel from "./CartPanel";
import Toast from "./Toast";
import { useCart } from "../hooks/useCart";

export default function Layout() {
    const navigate = useNavigate();
    const [cartOpen, setCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [orderData, setOrderData] = useState(null);
    const [modalProduct, setModalProduct] = useState(null);

    const {
        cart, setCart,
        cartCount,
        addToCart,
        updateQty,
        removeItem,
        toastMsg,
    } = useCart();

    const openProductModal = (product) => setModalProduct(product);

    return (
        <div style={{ minHeight: "100vh", background: "#0d0800", display: "flex", flexDirection: "column" }}>

            <Navbar
                cartCount={cartCount}
                onCartOpen={() => setCartOpen(true)}
                onLogoClick={() => navigate("/")}
                onSearch={setSearchQuery}
            />

            <main style={{ flex: 1 }}>
                <Outlet
                    context={{
                        addToCart,
                        openProductModal,
                        cart,
                        setCart,
                        updateQty,
                        removeItem,
                        searchQuery,
                        orderData,
                        setOrderData,
                    }}
                />
            </main>

            <Footer />

            {/* CartPanel — open prop controls visibility */}
            <CartPanel
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                cart={cart}
                updateQty={updateQty}
                removeItem={removeItem}
                onOrderComplete={(data) => {
                    setOrderData(data);
                    setCart([]);
                    setCartOpen(false);
                }}
            />

            {toastMsg && <Toast message={toastMsg} />}

            {modalProduct && (
                <ProductModal
                    product={modalProduct}
                    onClose={() => setModalProduct(null)}
                    onAddToCart={(p) => { addToCart(p); setModalProduct(null); }}
                />
            )}
        </div>
    );
}

/* ═══════════════════════════════════════
   Quick-View Product Modal
═══════════════════════════════════════ */
function ProductModal({ product, onClose, onAddToCart }) {
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? null);

    return (
        <>
            <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .modal-card { animation: modalIn 0.3s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed", inset: 0, zIndex: 50,
                    background: "rgba(0,0,0,0.8)",
                    backdropFilter: "blur(6px)",
                }}
            />

            {/* Modal */}
            <div style={{
                position: "fixed", inset: 0, zIndex: 51,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px", pointerEvents: "none",
            }}>
                <div
                    className="modal-card"
                    style={{
                        pointerEvents: "auto",
                        background: "#130900",
                        border: "1px solid #2a1500",
                        borderRadius: 20,
                        maxWidth: 800, width: "100%",
                        display: "flex", overflow: "hidden",
                        boxShadow: "0 40px 100px rgba(0,0,0,0.9), 0 0 60px rgba(255,107,0,0.07)",
                    }}
                >
                    {/* Image */}
                    <div style={{ width: 300, flexShrink: 0, position: "relative", background: "#0d0800" }}>
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        {product.badge && (
                            <span style={{
                                position: "absolute", top: 14, left: 14,
                                background: product.badge === "Sale" ? "#ff0040" : product.badge === "New" ? "#ff6b00" : "#2a1500",
                                color: "#fff", fontSize: 10, fontWeight: 700,
                                letterSpacing: "0.12em", textTransform: "uppercase",
                                padding: "3px 10px", borderRadius: 99,
                            }}>
                                {product.badge}
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, padding: "32px 30px", overflowY: "auto", maxHeight: "82vh" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#664433", padding: 4 }}>
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#664433", marginBottom: 6 }}>
                            {product.category}
                        </p>
                        <h2 className="heading" style={{ fontSize: 26, color: "#fff", marginBottom: 10, lineHeight: 1.2 }}>
                            {product.name}
                        </h2>

                        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 18 }}>
                            <span className="heading" style={{
                                fontSize: 22,
                                background: "linear-gradient(90deg,#ff6b00,#ff0040)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            }}>
                                {(product.price / 1000).toFixed(0)}K VND
                            </span>
                            {product.originalPrice && (
                                <span style={{ fontSize: 14, color: "#664433", textDecoration: "line-through" }}>
                                    {(product.originalPrice / 1000).toFixed(0)}K
                                </span>
                            )}
                        </div>

                        <p style={{ fontSize: 13, color: "#aa8866", lineHeight: 1.75, marginBottom: 22 }}>
                            {product.description}
                        </p>

                        {/* Size picker */}
                        {product.sizes?.length > 0 && (
                            <div style={{ marginBottom: 24 }}>
                                <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#664433", marginBottom: 10 }}>
                                    Size — <span style={{ color: "#ff6b00" }}>{selectedSize}</span>
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {product.sizes.map((s) => (
                                        <button key={s} onClick={() => setSelectedSize(s)} style={{
                                            padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                            transition: "all 0.15s",
                                            background: selectedSize === s ? "linear-gradient(135deg,#ff6b00,#ff0040)" : "#1e1000",
                                            color: selectedSize === s ? "#fff" : "#664433",
                                            border: selectedSize === s ? "1px solid transparent" : "1px solid #2a1500",
                                        }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => onAddToCart({ ...product, selectedSize })}
                            style={{
                                width: "100%", padding: "13px 0", borderRadius: 10,
                                border: "none", cursor: "pointer",
                                background: "linear-gradient(135deg,#ff6b00,#ff0040)",
                                color: "#fff", fontWeight: 700, fontSize: 13,
                                letterSpacing: "0.12em", textTransform: "uppercase",
                                boxShadow: "0 8px 24px rgba(255,107,0,0.3)",
                                transition: "transform 0.15s, box-shadow 0.15s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(255,107,0,0.45)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,107,0,0.3)"; }}
                        >
                            Add to Cart
                        </button>

                        <div style={{ marginTop: 22, borderTop: "1px solid #1e1000", paddingTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                            {product.material && (
                                <p style={{ fontSize: 11, color: "#443322", lineHeight: 1.6 }}>
                                    <strong style={{ color: "#664433" }}>Material: </strong>{product.material}
                                </p>
                            )}
                            {product.care && (
                                <p style={{ fontSize: 11, color: "#443322", lineHeight: 1.6 }}>
                                    <strong style={{ color: "#664433" }}>Care: </strong>{product.care}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}