import { PRODUCTS } from "../data/constants";
import baseUrl from "./config";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export const getProducts = () => {
    if (USE_MOCK) return Promise.resolve(PRODUCTS);
    return baseUrl.get("/products").then((res) => res.data);
};

export const getProductById = (id) => {
    if (USE_MOCK)
        return Promise.resolve(PRODUCTS.find((p) => p.id === id) ?? null);
    return baseUrl.get(`/products/${id}`).then((res) => res.data);
};