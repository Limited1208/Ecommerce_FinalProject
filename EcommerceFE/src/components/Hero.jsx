export default function Hero({ onShopNow }) {
    return (
        <section className="relative overflow-hidden min-h-[90vh] flex items-center" style={{ background: "#0d0800" }}>

            {/* Background grid lines */}
            <div className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: "linear-gradient(#ff6b00 1px, transparent 1px), linear-gradient(90deg, #ff6b00 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Fire glow blobs */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, #ff6b00, transparent 70%)" }}
            />
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, #ff0040, transparent 70%)" }}
            />

            <div className="relative max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center w-full">

                {/* Text */}
                <div>
                    <div className="stagger-1 flex items-center gap-2 mb-6">
                        <div className="h-px w-8 bg-[#ff6b00]" />
                        <p className="text-xs tracking-[0.3em] uppercase text-[#ff6b00]">New Season 2025</p>
                    </div>

                    <h1 className="stagger-2 heading leading-none text-white mb-2" style={{ fontSize: "clamp(4rem, 10vw, 7rem)" }}>
                        PUSH
                    </h1>
                    <h1 className="stagger-2 heading leading-none mb-2" style={{ fontSize: "clamp(4rem, 10vw, 7rem)", WebkitTextStroke: "2px #ff6b00", color: "transparent" }}>
                        YOUR
                    </h1>
                    <h1 className="stagger-2 heading leading-none text-white mb-8" style={{ fontSize: "clamp(4rem, 10vw, 7rem)" }}>
                        LIMITS.
                    </h1>

                    <p className="stagger-3 text-sm leading-relaxed max-w-xs mb-8" style={{ color: "#664433" }}>
                        Pro-grade gear engineered for athletes who never settle. Lightweight, durable, built to perform.
                    </p>

                    <div className="stagger-4 flex items-center gap-4">
                        <button
                            onClick={onShopNow}
                            className="neon-btn text-white px-8 py-3.5 rounded-lg text-xs tracking-widest uppercase font-bold hover:scale-105 transition-all"
                            style={{ background: "linear-gradient(135deg, #ff6b00, #ff0040)" }}
                        >
                            Shop Now →
                        </button>
                        <a href="#" className="text-xs tracking-widest uppercase hover:text-white transition-colors border-b pb-0.5"
                            style={{ color: "#664433", borderColor: "#2a1500" }}
                        >
                            View Lookbook
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="stagger-4 flex gap-8 mt-12 pt-8" style={{ borderTop: "1px solid #1e1000" }}>
                        {[["50K+", "Athletes"], ["300+", "Products"], ["4.9★", "Rating"]].map(([val, label]) => (
                            <div key={label}>
                                <p className="heading text-2xl text-[#ff6b00]">{val}</p>
                                <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color: "#664433" }}>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image collage */}
                <div className="relative h-[480px] hidden md:block">
                    <div
                        className="absolute right-0 top-0 w-60 h-80 rounded-2xl overflow-hidden"
                        style={{ animation: "slideUp 0.7s 0.2s both ease", border: "1px solid #1e1000", boxShadow: "0 0 40px rgba(255,107,0,0.08)" }}
                    >
                        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop" alt="athlete" className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0d080099, transparent)" }} />
                    </div>

                    <div
                        className="absolute left-0 bottom-8 w-52 h-64 rounded-2xl overflow-hidden"
                        style={{ animation: "slideUp 0.7s 0.35s both ease", border: "1px solid #1e1000", boxShadow: "0 0 40px rgba(255,0,64,0.06)" }}
                    >
                        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=480&fit=crop" alt="shoe" className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0d080099, transparent)" }} />
                    </div>

                    {/* Floating stat card */}
                    <div
                        className="absolute right-12 bottom-12 rounded-xl px-5 py-3"
                        style={{
                            animation: "slideUp 0.7s 0.5s both ease",
                            background: "#150900",
                            border: "1px solid #ff6b0033",
                            boxShadow: "0 0 24px rgba(255,107,0,0.1)",
                        }}
                    >
                        <p className="text-[10px] uppercase tracking-widest" style={{ color: "#664433" }}>Free shipping</p>
                        <p className="heading text-lg text-[#ff6b00]">Over $300</p>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute left-16 top-12 w-12 h-12 opacity-30" style={{ animation: "slideUp 0.7s 0.45s both ease", borderLeft: "2px solid #ff6b00", borderTop: "2px solid #ff6b00" }} />
                    <div className="absolute right-4 bottom-32 w-8 h-8 opacity-20" style={{ animation: "slideUp 0.7s 0.55s both ease", borderRight: "2px solid #ff0040", borderBottom: "2px solid #ff0040" }} />
                </div>
            </div>
        </section>
    );
}