const ITEMS = ["Free Returns", "Next Day Delivery", "Pro Athlete Endorsed", "30-Day Guarantee", "Free Shipping $300+"];

export default function MarqueeStrip() {
  return (
    <div className="overflow-hidden py-3" style={{ background: "linear-gradient(90deg, #ff6b00, #ff0040, #ff6b00)", borderTop: "1px solid #ff6b0033", borderBottom: "1px solid #ff6b0033" }}>
      <div className="flex gap-12 items-center whitespace-nowrap" style={{ animation: "marquee 20s linear infinite" }}>
        {Array(4).fill(null).map((_, i) => (
          <span key={i} className="flex items-center gap-12 text-[11px] tracking-widest uppercase text-white font-bold">
            {ITEMS.map((item, j) => (
              <span key={j} className="flex items-center gap-12">
                <span>{item}</span>
                <span>🔥</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}