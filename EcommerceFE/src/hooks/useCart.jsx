import { useState } from "react";

export function useCart() {
    const [cart, setCart] = useState([]);
    const [toastMsg, setToastMsg] = useState(null);

    const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
                return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...product, qty: 1 }];
        });
        setToastMsg(`${product.name} added to cart`);
        setTimeout(() => setToastMsg(null), 2200);
    };

    const updateQty = (id, delta) => {
        setCart((prev) =>
            prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
        );
    };

    const removeItem = (id) => {
        setCart((prev) => prev.filter((i) => i.id !== id));
    };

    return { cart, setCart, cartCount, addToCart, updateQty, removeItem, toastMsg };
}