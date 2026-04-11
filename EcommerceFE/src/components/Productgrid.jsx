import { useState } from "react";
import ProductCard from "./ProductCard";
import { useProducts,useCategories } from "../hooks/useProducts";
import { gradients, shadows, tw } from "../assets/theme";

const INITIAL_LIMIT = 6;

function ProductGrid({ onAddToCart }) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [showAll, setShowAll] = useState(false);
    const { products, loading, error } = useProducts();
    const {categories, catLoading, catError} = useCategories();

    const filtered = activeCategory === "All"
        ? products
        : products.filter((p) =>
            (p.category ?? p.categoryId ?? "")
                .toLowerCase()
                .includes(activeCategory.toLowerCase())
        );

    // Reset showAll when category changes
    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        setShowAll(false);
    };

    const displayed  = showAll ? filtered : filtered.slice(0, INITIAL_LIMIT);
    const hasMore    = filtered.length > INITIAL_LIMIT;

    const ALL_CATS = categories        ? ["All", ...categories.map((c) => c.name)]
                    : CATEGORIES.length ? ["All", ...CATEGORIES]
                    : ["All"];

    return (
        <section id="products" className="max-w-6xl mx-auto px-6 py-16">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <p className={`${tw.labelOrange} mb-2`}>Fresh Drops</p>
                    <h2 className="heading text-4xl text-white">NEW ARRIVALS</h2>
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap gap-2">
                    {ALL_CATS.map((cat) => {
                        const active = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className="px-4 py-1.5 rounded-lg text-xs tracking-widest uppercase font-semibold transition-all hover:scale-[1.02] cursor-pointer border-none"
                                style={{
                                    background: active ? gradients.brand : "#130900",
                                    color:      active ? "#fff"          : "#664433",
                                    border:     active ? "none"          : "1px solid #2a1500",
                                    boxShadow:  active ? shadows.btnGlow : "none",
                                }}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center py-16 gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-[#ff6b00] border-t-transparent animate-spin" />
                        <p className="text-xs tracking-widest uppercase text-[#664433]">Loading products…</p>
                    </div>
                ) : error ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-sm text-[#ff0040]">{error}</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-sm text-[#664433]">No products in this category.</p>
                    </div>
                ) : (
                    displayed.map((product) => (
                        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                    ))
                )}
            </div>

            {/* Show more / collapse button */}
            {!loading && !error && hasMore && (
                <div className="mt-12 text-center">
                    <button
                        onClick={() => setShowAll((v) => !v)}
                        className="px-10 py-3 rounded-lg text-xs tracking-widest uppercase font-semibold transition-all hover:scale-[1.02] cursor-pointer border-none"
                        style={{
                            background: showAll ? "#130900"       : gradients.brand,
                            color:      showAll ? "#ff6b00"       : "#fff",
                            border:     showAll ? "1px solid #ff6b0044" : "none",
                            boxShadow:  showAll ? "none"           : shadows.btnGlow,
                        }}
                    >
                        {showAll
                            ? `Show Less ↑`
                            : `View All ${filtered.length} Products ↓`}
                    </button>
                </div>
            )}
        </section>
    );
}

export default ProductGrid;