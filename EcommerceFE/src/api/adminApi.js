import baseUrl from "./config";
import adminClient from "./adminClient";

/**
 * POST /admin/login — body: { email, password }
 * Expects: { token | accessToken, user? } (same shape ideas as shop auth).
 * Uses plain axios so a 401 on wrong password does not run the shop auth interceptor.
 */
export const adminLoginApi = (email, password) =>
    baseUrl.post(`/auth/admin/login`, { email, password }).then((res) => res.data);

/** Optional: GET /admin/stats — adjust path to match your backend. */
export const fetchAdminStats = () =>
    adminClient.get("/stats").then((res) => res.data);

function extractArray(payload, keys = []) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];
    if (Array.isArray(payload.data)) return payload.data;
    for (const k of keys) {
        if (Array.isArray(payload[k])) return payload[k];
    }
    return [];
}

export async function fetchAdminProducts(params = {}) {
    try {
        const { data } = await adminClient.get("/products", { params: { isActive: true, ...params } });
        return {
            items: extractArray(data, ["products", "content", "items", "data"]),
            meta: data.meta ?? {},
        };
    } catch {
        return { items: [], meta: {} };
    }
}

export async function fetchAdminUsers(params = {}) {
    try {
        const { data } = await adminClient.get("/users", { params });
        return {
            items: extractArray(data, ["users", "content", "items", "data"]),
            meta: data.meta ?? {},
        };
    } catch {
        return { items: [], meta: {} };
    }
}

/** GET /admin/categories — on empty/error uses counts from local catalog. */
export async function fetchAdminCategories(params = {}) {
    try {
        const { data } = await adminClient.get("/categories", { params });
        return {
            items: extractArray(data, ["categories", "content", "items", "data"]),
            meta: data.meta ?? {},
        };
    } catch {
        return { items: [], meta: {} };
    }
}

/** GET /admin/orders */
export async function fetchAdminOrders(params = {}) {
    try {
        const { data } = await adminClient.get("/orders/admin/all", { params });
        return {
            items: extractArray(data, ["orders", "content", "items", "data"]),
            meta: data.meta ?? { total: data.total, page: data.page, limit: data.limit },
        };
    } catch {
        return { items: [], meta: {} };
    }
}


export function getProductsForCategoryCount() { 
    return [];
}

export function defaultNewProduct() {
    return {};
}

export function getCategoryOptions() {
    return fetchAdminCategories().then(({ items }) => items.map((c) => ({ id: c.id, name: c.name })));
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

/* ── Persist attempts: PATCH a single row by id. Callsites that only want to
 * sync list state after a delete should rely on tryDelete* instead. ── */

export async function persistProducts(id, row) {
    try {
        await adminClient.patch(`/products/${id}`, row);
    } catch {
        /* local-only */
    }
}

export async function persistUsers(id, row) {
    try {
        await adminClient.patch(`/users/${id}`, row);
    } catch {
        /* local-only */
    }
}

export async function persistCategories(id, row) {
    try {
        await adminClient.patch(`/categories/${id}`, row);
    } catch {
        /* local-only */
    }
}

export async function persistOrders(id, row) {
    try {
        await adminClient.patch(`/orders/admin/${id}`, row);
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
        await adminClient.delete(`/orders/admin/${orderId}`);
    } catch {
        /* local-only */
    }
}
