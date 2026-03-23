export default function LoadingSpinner({ size = 16, color = "#fff" }) {
    return (
        <div
            className="rounded-full border-2 border-t-transparent flex-shrink-0 animate-[spin_0.7s_linear_infinite]"
            style={{
                width: size,
                height: size,
                borderColor: `${color} ${color} ${color} transparent`,
            }}
        />
    );
}