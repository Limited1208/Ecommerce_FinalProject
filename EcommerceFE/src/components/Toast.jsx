export default function Toast({ message }) {
    if (!message) return null;
    return (
        <div
            key={message}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 text-white px-5 py-3 rounded-lg text-xs tracking-widest uppercase font-bold pointer-events-none"
            style={{
                animation: "toastIn 2.2s ease forwards",
                background: "linear-gradient(135deg, #ff6b00, #ff0040)",
                boxShadow: "0 0 24px rgba(255,107,0,0.5), 0 0 48px rgba(255,0,64,0.2)",
            }}
        >
            🔥 {message}
        </div>
    );
}