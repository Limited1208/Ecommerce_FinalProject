import { useEffect, useState } from "react";

const STORAGE_KEY = "strikezon:cart";

function loadCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function useCart() {
    const [cart, setCart] = useState(loadCart);
    const [toastMsg, setToastMsg] = useState(null);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch {
            /* quota / disabled storage — ignore */
        }
    }, [cart]);

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
