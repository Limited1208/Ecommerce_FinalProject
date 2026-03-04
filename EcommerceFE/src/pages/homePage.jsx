import { useState } from "react";
import { useCart } from "../hooks/useCart";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MarqueeStrip from "../components/MarqueeStrip";
import ProductGrid from "../components/Productgrid";
import EditorialBanner from "../components/Editorialbanner";
import CartPanel from "../components/CartPanel";
import Toast from "../components/Toast";
import ShoppingCart from "./shoppingCart";
import Footer from "../components/Footer";
import { globalStyles } from "./globalStyles";


export default function App() {
    const [cartOpen, setCartOpen] = useState(false);
    const [page, setPage] = useState("home"); 
    const [orderData, setOrderData] = useState(null);
    const { cart, setCart, cartCount, addToCart, updateQty, removeItem, toastMsg } = useCart();

    const scrollToProducts = () =>
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });

    // Receive order summary snapshot from CartPanel, navigate to cart page
    const goToCartPage = (data) => {
        setOrderData(data);
        setCartOpen(false);
        setPage("cart");
    };

    const goHome = () => {
        setPage("home");
        setOrderData(null);
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <style>{globalStyles}</style>

            {/* ── Shared Navbar on every page ── */}
            <Navbar
                cartCount={cartCount}
                onCartOpen={() => setCartOpen(true)}
                onLogoClick={goHome}
            />

            {/* ── Page routing ── */}
            {page === "home" && (
                <>
                    <Hero onShopNow={scrollToProducts} />
                    <MarqueeStrip />
                    <ProductGrid onAddToCart={addToCart} />
                    <EditorialBanner onCtaClick={() => setCartOpen(true)} />
                </>
            )}

            {page === "cart" && (
                <ShoppingCart
                    cart={cart}
                    setCart={setCart}
                    updateQty={updateQty}
                    removeItem={removeItem}
                    orderData={orderData}
                    onContinueShopping={goHome}
                />
            )}

            <Footer />

            {/* ── Cart drawer (available from any page) ── */}
            {cartOpen && (
                <CartPanel
                    cart={cart}
                    onUpdateQty={updateQty}
                    onRemoveItem={removeItem}
                    onClose={() => setCartOpen(false)}
                    onCheckout={goToCartPage}
                />
            )}

            <Toast message={toastMsg} />
        </div>
    );
}