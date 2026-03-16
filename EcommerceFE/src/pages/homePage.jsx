import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MarqueeStrip from "../components/MarqueeStrip";
import ProductGrid from "../components/Productgrid";
import EditorialBanner from "../components/Editorialbanner";
import { globalStyles } from "./globalStyles";
import { usePageTitle } from "../hooks/usePageTitle";


export default function App() {
    const { addToCart, openCart, openProductModal } = useOutletContext();
    usePageTitle('Home')

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