export function TruncId({ id }) {
    const s = String(id ?? "");
    return (
        <span className="font-mono text-[14px] text-[#2a1500] cursor-default" title={s}>
            {s.length > 8 ? s.slice(0, 8) + "…" : s}
        </span>
    );
}