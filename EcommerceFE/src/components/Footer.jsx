const FOOTER_COLS = [
  { title: "Shop",    links: ["New Drops", "Running", "Apparel", "Gear", "Sale"] },
  { title: "Help",    links: ["Shipping & Returns", "Size Guide", "Care Guide", "Contact Us"] },
  { title: "Company", links: ["About Us", "Sustainability", "Careers", "Press"] },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #1e1000", background: "#0d0800" }}>
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="url(#fireGrad2)">
              <defs>
                <linearGradient id="fireGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b00"/>
                  <stop offset="100%" stopColor="#ff0040"/>
                </linearGradient>
              </defs>
              <path d="M13 2L4.09 12.97H11L10 22l9.91-10.97H14L13 2z"/>
            </svg>
            <span className="heading text-xl text-white tracking-widest">STRIKEZON</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#664433" }}>
            Pro-grade athletic gear for athletes who never settle. Built to perform.
          </p>
          <div className="flex gap-3 mt-5">
            {["IG", "TW", "YT", "TK"].map((s) => (
              <a key={s} href="#"
                className="w-8 h-8 rounded flex items-center justify-center text-[10px] transition-all"
                style={{ border: "1px solid #1e1000", color: "#664433" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ff6b00"; e.currentTarget.style.color = "#ff6b00"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e1000"; e.currentTarget.style.color = "#664433"; }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <p className="text-[10px] tracking-widest uppercase text-[#ff6b00] mb-4">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs transition-colors" style={{ color: "#664433" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#664433"}
                  >{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 max-w-6xl mx-auto flex justify-between items-center" style={{ borderTop: "1px solid #1e1000" }}>
        <p className="text-[10px] tracking-wide" style={{ color: "#2a1500" }}>© 2025 STRIKEZON. All rights reserved.</p>
        <p className="text-[10px] tracking-wide" style={{ color: "#2a1500" }}>Built for <span className="text-[#ff6b00]">champions</span>. 🔥</p>
      </div>
    </footer>
  );
}