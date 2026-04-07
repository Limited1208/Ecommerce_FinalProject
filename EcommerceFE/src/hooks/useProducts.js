import { useEffect, useState } from "react";
import  BaseURL  from "../api/config";

// Tries to fetch from API only; no local fallback
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${BaseURL}/products?isActive=true&status=InStock&page=1&limit=10`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProducts(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError(err.message || "Failed to load products");
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}