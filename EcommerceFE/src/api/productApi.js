import baseUrl from "./config";

export async function getProducts() {
    const res = await baseUrl.get("/products", {
        params: { isActive: true, page: 1, limit: 100 },
    });

    const result = res.data.data ?? [];

    return result;
};

export const getProductByIdApi = (id) =>
    baseUrl.get(`/product/${id}`).then((res) => res.data);

export async function getCategory() {
    const res = await baseUrl.get("/categories", { params: { page: 1, limit: 10 } });;

    const result = res.data.data ?? [];
    return result;
}