import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export default function OrderConfirmationPage() {
    usePageTitle("Order Confirmed");
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f0eb] px-4">
            <div className="bg-white rounded-3xl shadow-sm max-w-md w-full p-10 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#eaf4ee] flex items-center justify-center text-3xl">
                    ✓
                </div>
                <h1 className="text-2xl font-semibold text-[#2c2c2c] mb-2">
                    Order Confirmed!
                </h1>
                <p className="text-sm text-[#888] mb-8 leading-relaxed">
                    Thank you for your purchase. We'll send you an email with your order details and tracking information.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="w-full bg-[#2c2c2c] text-white rounded-2xl py-3.5 text-sm tracking-widest uppercase hover:bg-[#111] transition-all"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}
