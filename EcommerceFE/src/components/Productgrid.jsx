import { useState, useEffect } from "react";
import { CATEGORIES } from "../data/constants";
import ProductCard from "./ProductCard";
import { fetchAdminProducts } from "../api/adminApi";

function ProductGrid({ onAddToCart }) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminProducts().then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    const filtered =
        activeCategory === "All"
            ? products
            : products.filter((p) => p.category === activeCategory);

    return (
        <section id="products" className="max-w-6xl mx-auto px-6 py-16">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-px w-6 bg-[#a855f7]" />
                        <p className="text-xs tracking-[0.3em] uppercase text-[#a855f7]">Fresh Drops</p>
                    </div>
                    <h2 className="heading text-4xl text-white">NEW ARRIVALS</h2>
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className="px-4 py-1.5 rounded text-xs tracking-widest uppercase font-semibold transition-all"
                            style={{
                                background: activeCategory === cat ? "#a855f7" : "#1a0e00",
                                color:      activeCategory === cat ? "#0a0a12" : "#555",
                                border:     activeCategory === cat ? "1px solid #a855f7" : "1px solid #2a1500",
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="card-grid grid grid-cols-2 md:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-[#664433]">
                        Loading products...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-[#664433]">
                        No products found.
                    </div>
                ) : (
                    filtered.map((product) => (
                        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                    ))
                )}
            </div>

            {/* Load more */}
            <div className="mt-12 text-center">
                <button className="border border-[#a855f744] text-[#a855f7] px-10 py-3 rounded-lg text-xs tracking-widest uppercase font-semibold hover:bg-[#a855f7] hover:text-[#0a0a12] transition-all">
                    View Full Collection
                </button>
            </div>

        </section>
    );
}

export default ProductGrid;