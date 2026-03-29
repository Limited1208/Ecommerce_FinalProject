const PREFIX = "ez_admin_v1_";

function read(key) {
    try {
        const s = localStorage.getItem(PREFIX + key);
        if (s == null) return null;
        return JSON.parse(s);
    } catch {
        return null;
    }
}

function write(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export const adminLocal = {
    loadProducts: () => read("products"),
    saveProducts: (list) => write("products", list),
    loadUsers: () => read("users"),
    saveUsers: (list) => write("users", list),
    loadCategories: () => read("categories"),
    saveCategories: (list) => write("categories", list),
    loadOrders: () => read("orders"),
    saveOrders: (list) => write("orders", list),
};
