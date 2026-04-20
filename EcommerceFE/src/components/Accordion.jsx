import { useState } from "react";

export default function Accordion({ title, children }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border-t border-[#1e1000]">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-full flex items-center justify-between py-4 text-left bg-transparent border-none cursor-pointer"
            >
                <span className="text-xs tracking-widest uppercase font-semibold text-[#664433]">
                    {title}
                </span>
                <span
                    className="text-[#ff6b00] text-sm transition-transform duration-300"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                    ▾
                </span>
            </button>

            <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open ? "500px" : "0px", opacity: open ? 1 : 0 }}
            >
                <div className="pb-4">
                    {children}
                </div>
            </div>
        </div>
    );
}