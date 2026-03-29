/** Fallback rows when GET /admin/users or /admin/orders is unavailable. */

export const MOCK_ADMIN_USERS = [
    { id: 1, email: "alex.m@email.com", firstName: "Alex", lastName: "Morgan", role: "customer", createdAt: "2025-11-02" },
    { id: 2, email: "sam.j@email.com", firstName: "Sam", lastName: "Jordan", role: "customer", createdAt: "2025-12-18" },
    { id: 3, email: "taylor.r@email.com", firstName: "Taylor", lastName: "Reed", role: "customer", createdAt: "2026-01-05" },
    { id: 4, email: "jordan.k@email.com", firstName: "Jordan", lastName: "Kim", role: "customer", createdAt: "2026-02-14" },
];

export const MOCK_ADMIN_ORDERS = [
    { id: "ORD-24089", customerEmail: "alex.m@email.com", total: 89.5, status: "Delivered", placedAt: "2026-03-20", items: 3 },
    { id: "ORD-24102", customerEmail: "sam.j@email.com", total: 124.0, status: "Shipped", placedAt: "2026-03-22", items: 2 },
    { id: "ORD-24117", customerEmail: "taylor.r@email.com", total: 45.99, status: "Processing", placedAt: "2026-03-25", items: 1 },
    { id: "ORD-24121", customerEmail: "jordan.k@email.com", total: 312.4, status: "Pending", placedAt: "2026-03-28", items: 5 },
    { id: "ORD-24130", customerEmail: "alex.m@email.com", total: 67.0, status: "Cancelled", placedAt: "2026-03-29", items: 2 },
];
