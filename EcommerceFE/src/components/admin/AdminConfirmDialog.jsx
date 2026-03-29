import { tw } from "../../assets/theme";

export default function AdminConfirmDialog({ title, message, confirmLabel = "Delete", onConfirm, onCancel, danger }) {
    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.82)" }}
            onClick={onCancel}
        >
            <div
                className={`${tw.card} max-w-md w-full p-6 border border-[#2a1500]`}
                onClick={(e) => e.stopPropagation()}
                role="alertdialog"
            >
                <h3 className="heading text-lg text-white mb-2">{title}</h3>
                <p className="text-sm text-[#aa8866] leading-relaxed mb-6">{message}</p>
                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`${tw.btnGhost} py-2 px-4 text-[11px]`}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`${tw.btnPrimary} py-2 px-4 text-[11px] ${
                            danger ? "!bg-[#ff0040] hover:opacity-90" : ""
                        }`}
                        style={
                            danger
                                ? { boxShadow: "0 4px 20px rgba(255,0,64,0.35)" }
                                : undefined
                        }
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
