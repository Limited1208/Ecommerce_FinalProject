import baseUrl from "./config";
import adminClient from "./adminClient";

/**
 * POST /admin/login — body: { email, password }
 * Expects: { token | accessToken, user? } (same shape ideas as shop auth).
 * Uses plain axios so a 401 on wrong password does not run the shop auth interceptor.
 */
export const adminLoginApi = (email, password) =>
    baseUrl.post(`/auth/login`, { email, password }).then((res) => res.data);

/** Optional: GET /admin/stats — adjust path to match your backend. */
export const fetchAdminStats = () =>
    baseUrl.get("/admin/stats").then((res) => res.data);

function firstArray(payload, keys) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];
    for (const k of keys) {
        if (Array.isArray(payload[k])) return payload[k];
    }
    return [];
}

/** GET /admin/products — on error uses storefront mock catalog. */
export async function fetchAdminProducts() {
    try {
        const { data } = await adminClient.get("/products", { params: { isActive: true, status: "InStock", page: 1, limit: 10 } });
        return firstArray(data, ["products", "content", "items", "data"]);
    } catch {
        return [];
    }
}

/** GET /admin/users */
export async function fetchAdminUsers() {
    try {
        const { data } = await adminClient.get("/users", { params: { page: 1, limit: 10 } });
        return firstArray(data, ["users", "content", "items", "data"]);
    } catch {
        return [];
    }
}

/** GET /admin/categories — on empty/error uses counts from local catalog. */
export async function fetchAdminCategories() {
    try {
        const { data } = await adminClient.get("/categories", { params: { page: 1, limit: 10 } });
        const list = firstArray(data, ["categories", "content", "items", "data"]);
        if (list.length) return list;
    } catch {
        return [];
    }
    return [];
}

/** GET /admin/orders */
export async function fetchAdminOrders() {
    try {
        const { data } = await adminClient.get("/orders/admin/all", { params: { page: 1, limit: 10 } });
        return firstArray(data, ["orders", "content", "items", "data"]);
    } catch {
        return [];
    }
}


export function getProductsForCategoryCount() { 
    return [];
}

export function defaultNewProduct() {
    return {};
}

export function getCategoryOptions() {
    return fetchAdminCategories().then((data) => data.map((c) => ({ id: c.id, name: c.name })));
}

export async function createProduct(product) {
    try {
        const res = await adminClient.post("/products", product);
        return res.data;
    } catch (err) {
        console.error("Create product error:", err.response?.data || err.message);
        throw err; // 🔥 rethrow so UI can handle it
    }
}

export async function createCategory(category) {
    try {
        const res = await adminClient.post("/categories", category);
        return res.data;
    } catch (err) {
        console.error("Create category error:", err.response?.data || err.message);
        throw err; 
    }
}

/* ── Persist attempts (API first; always save local copy for offline) ── */

export async function persistProducts(id, list) {
    try {
        await adminClient.patch(`/products/${id}`, list);
    } catch {
        /* local-only */
    }
}

export async function persistUsers(id, list) {
    try {
        console.log(id, list)
        await adminClient.patch(`/users/${id}`, list);
    } catch {
        /* local-only */
    }
}

export async function persistCategories(id, list) {
    try {
        await adminClient.patch(`categories/${id}`, list);
    } catch {
        /* local-only */
    }
}

export async function persistOrders(list) {
    try {
        await adminClient.patch("/orders", list);
    } catch {
        /* local-only */
    }
}

export async function tryDeleteProduct(id) {
    try {
        await adminClient.delete(`/products/${id}`);
    } catch {
        /* local-only */
    }
}

export async function tryDeleteUser(id) {
    try {
        await adminClient.delete(`/users/${id}`);
    } catch {
        /* local-only */
    }
}

export async function tryDeleteCategory(id) {
    try {
        await adminClient.delete(`/categories/${id}`);
    } catch {
        /* local-only */
    }
}

export async function tryDeleteOrder(orderId) {
    try {
        await adminClient.delete(`/orders/${orderId}`);
    } catch {
        /* local-only */
    }
}
