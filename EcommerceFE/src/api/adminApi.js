import baseUrl from "./config";
import adminClient from "./adminClient";
import { PRODUCTS, CATEGORIES } from "../data/constants";
import { MOCK_ADMIN_USERS, MOCK_ADMIN_ORDERS } from "../data/adminMocks";
import { adminLocal } from "../utils/adminLocalStore";

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

function derivedCategories() {
    return CATEGORIES.filter((c) => c !== "All").map((name) => ({
        name,
        productCount: PRODUCTS.filter((p) => p.category === name).length,
    }));
}

/** GET /admin/products — on error uses storefront mock catalog. */
export async function fetchAdminProducts() {
    try {
        const { data } = await adminClient.get("/admin/products");
        return firstArray(data, ["products", "content", "items", "data"]);
    } catch {
        return PRODUCTS;
    }
}

/** GET /admin/users */
export async function fetchAdminUsers() {
    try {
        const { data } = await adminClient.get("/admin/users");
        return firstArray(data, ["users", "content", "items", "data"]);
    } catch {
        return MOCK_ADMIN_USERS;
    }
}

/** GET /admin/categories — on empty/error uses counts from local catalog. */
export async function fetchAdminCategories() {
    try {
        const { data } = await adminClient.get("/admin/categories");
        const list = firstArray(data, ["categories", "content", "items", "data"]);
        if (list.length) return list;
    } catch {
        return derivedCategories();
    }
    return derivedCategories();
}

/** GET /admin/orders */
export async function fetchAdminOrders() {
    try {
        const { data } = await adminClient.get("/admin/orders");
        return firstArray(data, ["orders", "content", "items", "data"]);
    } catch {
        return MOCK_ADMIN_ORDERS;
    }
}

/* ── Resolved lists (localStorage overrides remote after first save) ── */

export async function resolveAdminProducts() {
    const local = adminLocal.loadProducts();
    if (local !== null) return local;
    return fetchAdminProducts();
}

export async function resolveAdminUsers() {
    const local = adminLocal.loadUsers();
    if (local !== null) return local;
    return fetchAdminUsers();
}

export async function resolveAdminOrders() {
    const local = adminLocal.loadOrders();
    if (local !== null) return local;
    return fetchAdminOrders();
}

/** Categories: optional local list; counts recomputed from products. */
export async function resolveAdminCategories() {
    const local = adminLocal.loadCategories();
    const base =
        local !== null
            ? local
            : await fetchAdminCategories();
    return applyCategoryCounts(base);
}

export function getProductsForCategoryCount() {
    const p = adminLocal.loadProducts();
    return p !== null ? p : PRODUCTS;
}

export function applyCategoryCounts(rows) {
    const products = getProductsForCategoryCount();
    return rows.map((row) => {
        const name = row.name ?? row.title ?? row.label ?? "";
        return {
            ...row,
            name,
            productCount: products.filter((p) => p.category === name).length,
        };
    });
}

export function nextProductId(products) {
    const nums = products.map((p) => Number(p.id)).filter((n) => !Number.isNaN(n));
    return (nums.length ? Math.max(...nums) : 0) + 1;
}

export function defaultNewProduct(id) {
    return {
        id,
        name: "New product",
        category: "Running",
        gender: "men",
        price: 29.99,
        badge: null,
        image:
            "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=500&h=600&fit=crop",
        variant: "Default",
        description: "Description added from admin.",
        material: "—",
        care: "—",
        sizes: ["S", "M", "L", "XL"],
        sizeChart: {
            headers: ["Size", "Chest (cm)"],
            rows: [
                ["S", "—"],
                ["M", "—"],
            ],
        },
    };
}

/* ── Persist attempts (API first; always save local copy for offline) ── */

export async function persistProducts(list) {
    adminLocal.saveProducts(list);
    try {
        await adminClient.put("/admin/products", { products: list });
    } catch {
        /* local-only */
    }
}

export async function persistUsers(list) {
    adminLocal.saveUsers(list);
    try {
        await adminClient.put("/admin/users", { users: list });
    } catch {
        /* local-only */
    }
}

export async function persistCategories(list) {
    adminLocal.saveCategories(list);
    try {
        await adminClient.put("/admin/categories", { categories: list });
    } catch {
        /* local-only */
    }
}

export async function persistOrders(list) {
    adminLocal.saveOrders(list);
    try {
        await adminClient.put("/admin/orders", { orders: list });
    } catch {
        /* local-only */
    }
}

export async function tryDeleteProduct(id) {
    try {
        await adminClient.delete(`/admin/products/${id}`);
    } catch {
        /* local-only */
    }
}

export async function tryDeleteUser(id) {
    try {
        await adminClient.delete(`/admin/users/${id}`);
    } catch {
        /* local-only */
    }
}

export async function tryDeleteCategory(slugOrName) {
    try {
        await adminClient.delete(`/admin/categories/${encodeURIComponent(slugOrName)}`);
    } catch {
        /* local-only */
    }
}

export async function tryDeleteOrder(orderId) {
    try {
        await adminClient.delete(`/admin/orders/${encodeURIComponent(orderId)}`);
    } catch {
        /* local-only */
    }
}
