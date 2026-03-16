import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar    from "../components/Navbar";
import Footer    from "../components/Footer";
import CartPanel from "../components/CartPanel";
import Toast     from "../components/Toast";
import { useCart } from "../hooks/useCart";

export default function Layout() {
    const navigate = useNavigate();
    const [cartOpen, setCartOpen]         = useState(false);
    const [searchQuery, setSearchQuery]   = useState("");
    const [orderData, setOrderData]       = useState(null);
    const [modalProduct, setModalProduct] = useState(null);

    const { cart, setCart, cartCount, addToCart, updateQty, removeItem, toastMsg } = useCart();

    return (
        <div className="min-h-screen bg-[#0d0800] flex flex-col">

            <Navbar
                cartCount={cartCount}
                onCartOpen={() => setCartOpen(true)}
                onLogoClick={() => navigate("/")}
                onSearch={setSearchQuery}
            />

            <main className="flex-1">
                <Outlet context={{
                    addToCart,
                    openProductModal: setModalProduct,
                    cart, setCart,
                    updateQty, removeItem,
                    searchQuery,
                    orderData, setOrderData,
                }} />
            </main>

            <Footer />

            <CartPanel
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                cart={cart}
                updateQty={updateQty}
                removeItem={removeItem}
                onOrderComplete={(data) => {
                    setOrderData(data);
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

    const fmt = (n) => `$${Number(n).toFixed(2)}`;

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
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Centering shell */}
            <div className="fixed inset-0 z-51 flex items-center justify-center p-5 pointer-events-none"
                style={{ zIndex: 51 }}>
                <div
                    className="modal-card pointer-events-auto bg-[#130900] border border-[#2a1500] rounded-[20px] w-full max-w-[800px] flex overflow-hidden"
                    style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.9), 0 0 60px rgba(255,107,0,0.07)" }}
                >
                    {/* Image */}
                    <div className="w-[300px] flex-shrink-0 relative bg-[#0d0800]">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover block"
                        />
                        {product.badge && (
                            <span
                                className="absolute top-3.5 left-3.5 text-white text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-0.5 rounded-full"
                                style={{
                                    background: product.badge === "Sale" ? "#ff0040"
                                              : product.badge === "New"  ? "#ff6b00"
                                              : "#2a1500",
                                }}
                            >
                                {product.badge}
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-8 py-8 overflow-y-auto max-h-[82vh]">

                        {/* Close */}
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={onClose}
                                className="text-[#664433] hover:text-white transition-colors p-1 bg-transparent border-none cursor-pointer"
                            >
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Category */}
                        <p className="text-[10px] tracking-[0.2em] uppercase text-[#664433] mb-1.5">
                            {product.category}
                        </p>

                        {/* Name */}
                        <h2 className="heading text-[26px] text-white leading-tight mb-2.5">
                            {product.name}
                        </h2>

                        {/* Price */}
                        <div className="flex items-baseline gap-2.5 mb-4">
                            <span
                                className="heading text-[22px]"
                                style={{
                                    background: "linear-gradient(90deg,#ff6b00,#ff0040)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                {fmt(product.price)}
                            </span>
                            {product.originalPrice && (
                                <span className="text-sm text-[#664433] line-through">
                                    {fmt(product.originalPrice)}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-[#aa8866] leading-[1.75] mb-6">
                            {product.description}
                        </p>

                        {/* Size picker */}
                        {product.sizes?.length > 0 && (
                            <div className="mb-6">
                                <p className="text-[10px] tracking-[0.15em] uppercase text-[#664433] mb-2.5">
                                    Size — <span className="text-[#ff6b00]">{selectedSize}</span>
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((s) => {
                                        const active = selectedSize === s;
                                        return (
                                            <button
                                                key={s}
                                                onClick={() => setSelectedSize(s)}
                                                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                                                style={{
                                                    background: active ? "linear-gradient(135deg,#ff6b00,#ff0040)" : "#1e1000",
                                                    color:      active ? "#fff" : "#664433",
                                                    border:     active ? "1px solid transparent" : "1px solid #2a1500",
                                                }}
                                            >
                                                {s}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Add to cart */}
                        <button
                            onClick={() => onAddToCart({ ...product, selectedSize })}
                            className="w-full py-3.5 rounded-xl border-none cursor-pointer text-white font-bold text-sm tracking-[0.12em] uppercase transition-all hover:scale-[1.02]"
                            style={{
                                background: "linear-gradient(135deg,#ff6b00,#ff0040)",
                                boxShadow: "0 8px 24px rgba(255,107,0,0.3)",
                            }}
                        >
                            Add to Cart
                        </button>

                        {/* Material / Care */}
                        {(product.material || product.care) && (
                            <div className="mt-5 pt-4 border-t border-[#1e1000] flex flex-col gap-2">
                                {product.material && (
                                    <p className="text-[11px] text-[#443322] leading-relaxed">
                                        <strong className="text-[#664433]">Material: </strong>{product.material}
                                    </p>
                                )}
                                {product.care && (
                                    <p className="text-[11px] text-[#443322] leading-relaxed">
                                        <strong className="text-[#664433]">Care: </strong>{product.care}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}