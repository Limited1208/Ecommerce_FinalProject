export default function CartItem({ item, onUpdateQty, onRemove, isRemoving }) {
    return (
        <div
            className="flex gap-4 p-4"
            style={{
                opacity: isRemoving ? 0 : 1,
                transform: isRemoving ? "translateX(24px)" : "none",
                transition: "opacity 0.35s ease, transform 0.35s ease",
            }}
        >
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border border-[#2a1500]" />

            <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                    <div>
                        {item.badge && (
                            <span className="inline-block mb-1 text-[9px] tracking-widest uppercase px-2 py-0.5 rounded bg-[#ff6b00] text-[#0d0800] font-bold">
                                {item.badge}
                            </span>
                        )}
                        <p className="text-[13px] font-semibold text-white leading-snug">{item.name}</p>
                        <p className="text-[11px] text-[#444] mt-0.5">{item.variant}</p>
                    </div>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="text-[#333] text-lg hover:text-red-400 transition-colors leading-none ml-2"
                    >
                        ×
                    </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 border border-[#2a1500] rounded-lg px-2 py-0.5 bg-[#160a00]">
                        <button
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="w-5 h-5 flex items-center justify-center text-sm text-[#555] hover:text-[#ff6b00] transition-colors"
                        >
                            −
                        </button>
                        <span className="text-xs w-4 text-center text-white">{item.qty}</span>
                        <button
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-sm text-[#555] hover:text-[#ff6b00] transition-colors"
                        >
                            +
                        </button>
                    </div>
                    <p className="heading text-[15px] text-[#ff6b00]">${(item.price * item.qty).toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}