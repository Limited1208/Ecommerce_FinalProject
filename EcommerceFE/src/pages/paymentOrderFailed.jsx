import { useNavigate, useSearchParams } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export default function PaymentFailedPage() {
    usePageTitle("Payment Failed");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f0eb] px-4">
            <div className="bg-white rounded-3xl shadow-sm max-w-md w-full p-10 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#fdecea] flex items-center justify-center text-3xl">
                    ✕
                </div>
                <h1 className="text-2xl font-semibold text-[#2c2c2c] mb-2">
                    Payment Failed
                </h1>
                {orderId && (
                    <p className="text-xs text-[#aaa] mb-2 font-mono">#{orderId}</p>
                )}
                <p className="text-sm text-[#888] mb-8 leading-relaxed">
                    Your payment could not be processed. You have not been charged.
                    Please try again or use a different payment method.
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/checkout")}
                        className="w-full bg-[#2c2c2c] text-white rounded-2xl py-3.5 text-sm tracking-widest uppercase hover:bg-[#111] transition-all"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-transparent text-[#888] rounded-2xl py-3.5 text-sm tracking-widest uppercase hover:text-[#2c2c2c] transition-all border border-[#e0e0e0]"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}