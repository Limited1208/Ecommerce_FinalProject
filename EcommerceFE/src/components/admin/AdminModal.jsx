import { tw } from "../../assets/theme";

export default function AdminModal({ title, children, footer, onClose }) {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.82)" }}
            role="presentation"
            onClick={onClose}
        >
            <div
                className={`${tw.card} max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto border border-[#2a1500]`}
                style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="heading text-xl text-white">{title}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[#664433] hover:text-white text-xl leading-none px-1 cursor-pointer bg-transparent border-none"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                <div className="flex flex-col gap-3">{children}</div>
                {footer && <div className="mt-6 flex flex-wrap gap-2 justify-end">{footer}</div>}
            </div>
        </div>
    );
}
