const COLORS = ["#1e1000", "#ff0040", "#ff6b00", "#ffaa00", "#4ade80"];
const LABELS = ["", "Too short", "Fair", "Good", "Strong"];

export default function PasswordStrength({ password }) {
    if (!password?.length) return null;

    const strength = password.length >= 12 ? 4
        : password.length >= 10 ? 3
            : password.length >= 8 ? 2
                : 1;

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: level <= strength ? COLORS[strength] : "#1e1000" }}
                    />
                ))}
            </div>
            <p className="text-[11px] text-[#664433]">{LABELS[strength]}</p>
        </div>
    );
}