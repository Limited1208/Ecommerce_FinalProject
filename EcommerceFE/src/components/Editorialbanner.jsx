export default function EditorialBanner({ onCtaClick }) {
    return (
        <section className="max-w-6xl mx-auto px-6 pb-16">
            <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 flex items-center"
                style={{ background: "linear-gradient(135deg, #0d0800 0%, #1a0500 50%, #0d0005 100%)", border: "1px solid #1e1000" }}
            >
                <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop"
                    alt="athlete"
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                {/* Fire gradient overlay */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #0d0800 30%, transparent 100%)" }} />
                {/* Top fire line */}
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, #ff6b00, #ff0040, transparent)" }} />

                <div className="relative z-10 px-10 md:px-16">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-px w-6 bg-[#ff6b00]" />
                        <p className="text-xs tracking-[0.3em] uppercase text-[#ff6b00]">Limited Offer</p>
                    </div>
                    <h2 className="heading text-4xl md:text-5xl text-white leading-tight mb-4">
                        10% OFF<br />YOUR FIRST ORDER.
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "#664433" }}>
                        Use code <span className="font-bold tracking-widest text-[#ff6b00]">SAVE10</span> at checkout.
                    </p>
                    <button
                        onClick={onCtaClick}
                        className="neon-btn text-white px-7 py-3 rounded-lg text-xs tracking-widest uppercase font-bold hover:scale-105 transition-all"
                        style={{ background: "linear-gradient(135deg, #ff6b00, #ff0040)" }}
                    >
                        Shop & Save 🔥
                    </button>
                </div>
            </div>
        </section>
    );
}