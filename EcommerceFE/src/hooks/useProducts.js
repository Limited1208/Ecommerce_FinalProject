import { useEffect, useState } from "react";
import { getProducts, getCategory } from "../api/productApi";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message ?? "Failed to load products."))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getCategory()
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message ?? "Failed to load categories."))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}