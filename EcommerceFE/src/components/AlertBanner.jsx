export function ErrorBanner({ message }) {
    if (!message) return null;
    return (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#1a0005] border border-[#ff004033]">
            <span className="text-[#ff0040] text-base leading-none">⚠</span>
            <p className="text-xs text-[#ff0040]">{message}</p>
        </div>
    );
}

export function SuccessBanner({ message }) {
    if (!message) return null;
    return (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#0d1a00] border border-[#4ade8033]">
            <span className="text-green-400 leading-none">✓</span>
            <p className="text-xs text-green-400">{message}</p>
        </div>
    );
}