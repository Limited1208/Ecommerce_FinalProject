import { useEffect, useState } from "react";
import { PRODUCTS } from "../data/constants";

// Tries to fetch from API; falls back to local constants if unavailable
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://localhost:7287/api/Product", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = data?.products ?? data ?? [];
        setProducts(list.length > 0 ? list : PRODUCTS);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          // API unavailable — use local fallback silently
          setProducts(PRODUCTS);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { products, loading, error };
}