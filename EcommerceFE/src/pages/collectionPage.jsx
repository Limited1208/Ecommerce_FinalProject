import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { usePageTitle } from "../hooks/usePageTitle";

export default function CollectionPage({ gender, category, title, subtitle }) {
    const context = useOutletContext() ?? {};
    const { addToCart = () => { }, openProductModal = () => { } } = context;
    const { products, loading, error } = useProducts();

    usePageTitle(title)

    // Filter products by category or gender
    const baseProducts = products.filter((p) => {
        if (category) return p.category?.toLowerCase() === category.toLowerCase();
        if (gender) return p.gender === gender || p.gender === "unisex";
        return true;
    });

    const categories = ["All", ...new Set(baseProducts.map((p) => p.category))];
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered =
        activeCategory === "All"
            ? baseProducts
            : baseProducts.filter((p) => p.category === activeCategory);

    // ── Loading state ──
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="w-10 h-10 rounded-full border-2 border-[#c8a96e] border-t-transparent mx-auto mb-4"
                        style={{ animation: "spin 0.8s linear infinite" }}
                    />
                    <p className="text-sm text-[#aaa] tracking-widest uppercase">Loading…</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        );
    }

    // ── Error state ──
    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
                <div>
                    <p className="text-4xl mb-4">⚠️</p>
                    <p className="heading text-2xl text-[#2c2c2c] mb-2">Failed to load products</p>
                    <p className="text-sm text-[#aaa]">Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        .fade-in { animation: slideUp 0.55s ease both; }
      `}</style>

            {/* ── Hero Banner ── */}
            <div
                className="relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #2c2c2c 0%, #4a3f35 100%)",
                    minHeight: 260,
                }}
            >
                {/* Decorative circles */}
                <div
                    className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10"
                    style={{ background: "#c8a96e" }}
                />
                <div
                    className="absolute -right-8 -bottom-20 w-48 h-48 rounded-full opacity-10"
                    style={{ background: "#c8a96e" }}
                />

                <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
                    <p className="text-xs tracking-widest uppercase text-[#c8a96e] mb-3 fade-in">
                        {gender === "women"
                            ? "Womenswear"
                            : gender === "men"
                                ? "Menswear"
                                : category ?? "Collection"}
                    </p>
                    <h1
                        className="heading text-5xl text-white mb-3 fade-in"
                        style={{ animationDelay: "0.05s" }}
                    >
                        {title}
                    </h1>
                    <p
                        className="text-[#bbb] text-sm max-w-md fade-in"
                        style={{ animationDelay: "0.1s" }}
                    >
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* ── Product Section ── */}
            <section className="max-w-6xl mx-auto px-6 py-12">

                {/* Filter bar + item count */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <p className="text-sm text-[#999]">
                        <span className="heading text-[#2c2c2c] text-base">{filtered.length}</span>{" "}
                        items
                    </p>

                    {/* Show category filter pills only when browsing by gender */}
                    {gender && categories.length > 2 && (
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className="px-4 py-1.5 rounded-full text-xs tracking-widest uppercase transition-all"
                                    style={{
                                        background: activeCategory === cat ? "#2c2c2c" : "white",
                                        color: activeCategory === cat ? "#f5f0eb" : "#888",
                                        border: activeCategory === cat
                                            ? "1px solid #2c2c2c"
                                            : "1px solid #e5e5e5",
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        {filtered.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                                onViewDetail={openProductModal}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center text-[#bbb]">
                        <p className="text-4xl mb-4">🏃</p>
                        <p className="heading text-2xl text-[#2c2c2c] mb-2">No products found</p>
                        <p className="text-sm">This category is coming soon. Check back later!</p>
                    </div>
                )}
            </section>
        </>
    );
}