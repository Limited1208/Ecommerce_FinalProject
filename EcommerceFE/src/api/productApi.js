import baseUrl from "./config";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export const getProducts = () => {
    if (USE_MOCK) return Promise.resolve([]);
    return baseUrl.get("/products", { params: { isActive: true, status: "InStock", page: 1, limit: 10 } }).then((res) => res.data.data);
};

export const getProductById = (id) => {
    if (USE_MOCK)
        return Promise.resolve([]);
    return baseUrl.get(`/products/${id}`).then((res) => res.data.data);
};