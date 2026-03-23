const STEPS = ["Shipping", "Payment", "Review"];

export default function CheckoutSteps({ current }) {
    return (
        <div className="flex items-center mb-10">
            {STEPS.map((label, i) => {
                const done = i < current;
                const active = i === current;
                return (
                    <div key={label} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                                style={{
                                    background: done || active ? "linear-gradient(135deg,#ff6b00,#ff0040)" : "#1e1000",
                                    color: done || active ? "#fff" : "#2a1500",
                                    border: done || active ? "none" : "1px solid #2a1500",
                                    boxShadow: active ? "0 0 16px rgba(255,107,0,0.4)" : "none",
                                }}
                            >
                                {done ? "✓" : i + 1}
                            </div>
                            <span
                                className="text-[9px] tracking-[0.15em] uppercase whitespace-nowrap"
                                style={{ color: done || active ? "#ff6b00" : "#2a1500" }}
                            >
                                {label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div
                                className="flex-1 h-px mx-2 mb-5 transition-all"
                                style={{ background: done ? "linear-gradient(90deg,#ff6b00,#ff0040)" : "#1e1000" }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}