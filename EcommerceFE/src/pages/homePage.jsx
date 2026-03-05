import { useOutletContext } from "react-router-dom";
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
    const { addToCart, openCart, openProductModal } = useOutletContext();

  const scrollToProducts = () =>
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
    <style>{globalStyles}</style>
      <Hero onShopNow={scrollToProducts} />
      <MarqueeStrip />
      <ProductGrid onAddToCart={addToCart} onViewDetail={openProductModal} />
      <EditorialBanner onCtaClick={openCart} />
    </>
  );
}