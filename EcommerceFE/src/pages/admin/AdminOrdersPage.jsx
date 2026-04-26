import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { usePageTitle } from "../../hooks/usePageTitle";
import { persistOrders, tryDeleteOrder, fetchAdminOrders } from "../../api/adminApi";
import PaginationControls from "../../components/admin/PaginationControls";
import { tw } from "../../assets/theme";
import AdminPageShell from "../../components/admin/AdminPageShell";
import AdminModal from "../../components/admin/AdminModal";
import AdminConfirmDialog from "../../components/admin/AdminConfirmDialog";
import { TruncId } from "../../components/functions/truncId";

const STATUS_STYLES = {
    DELIVERED: "bg-[#14532d] text-[#86efac] border border-[#166534]",
    SHIPPED: "bg-[#1e3a5f] text-[#93c5fd] border border-[#1d4ed8]",
    PROCESSING: "bg-[#713f12] text-[#fde047] border border-[#a16207]",
    PENDING: "bg-[#2a1500] text-[#aa8866] border border-[#2a1500]",
    CANCELLED: "bg-[#450a0a] text-[#fca5a5] border border-[#991b1b]",
};

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

function statusClass(status) {
    return STATUS_STYLES[status] ?? "bg-[#2a1500] text-[#aa8866] border border-[#2a1500]";
}

export default function AdminOrdersPage() {
    usePageTitle("Admin · Orders");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

    const reload = useCallback(() => {
        setLoading(true);
        fetchAdminOrders({ page, limit }).then(({ items, meta }) => {
            setRows(items);
            setMeta(meta || { total: 0, page, limit });
            setLoading(false);
        });
    }, [page, limit]);

    useEffect(() => {
        reload();
    }, [reload]);

    const idOf = (o) => o.id ?? o.orderId ?? o.number ?? "—";
    const emailOf = (o) => o.userEmail;
    const formatDisplayDate = (o) =>
        new Date(o.createdAt).toLocaleDateString();
    const formatDateInput = (value) => {
        if (!value) return "";
        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
        if (typeof value === "string") {
            const match = value.match(/(\d{4}-\d{2}-\d{2})/);
            if (match) return match[1];
        }
        return "";
    };
    const itemsOf = (o) => {
        if (Array.isArray(o.items)) return o.items.length;
        if (Array.isArray(o.orderItem)) return o.orderItem.length;
        return typeof o.items === "number" ? o.items : 0;
    };


    const openCreate = () => {
        const id = `ORD-${Date.now()}`;
        setForm({
            id,
            customerEmail: "",
            total: 0,
            status: "Pending",
            placedAt: new Date().toISOString().slice(0, 10),
            items: 1,
        });
        setModal(true);
    };

    const openEdit = (o) => {
        setForm({
            id: idOf(o),
            customerEmail: emailOf(o),
            total: typeof o.total === "number" ? o.total : Number(o.total) || 0,
            status: o.status ?? "Pending",
            placedAt: formatDateInput(Date.now()),
            items: itemsOf(o),
        });
        setModal(true);
    };

    const saveOrder = async () => {
        if (!form) return;
        const existing = rows.find((r) => String(idOf(r)) === String(form.id));
        const now = new Date().toISOString();
        const updatedRow = existing
            ? {
                ...existing,
                status: form.status,
                updatedAt: now, // ✅ FIX
            }
            : {
                id: form.id,
                userEmail: form.customerEmail,
                totalAmount:
                    typeof form.total === "number"
                        ? form.total
                        : parseFloat(form.total) || 0,
                status: form.status,
                createdAt: form.placedAt,
                updatedAt: now, 
            };
        const next = existing
            ? rows.map((r) => (String(idOf(r)) === String(form.id) ? updatedRow : r))
            : [...rows, updatedRow];

        setRows(next);
        await persistOrders(form.id, { status: form.status.toUpperCase(), updatedAt: now });
        setModal(false);
        setForm(null);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        const oid = idOf(deleteTarget);
        const next = rows.filter((r) => String(idOf(r)) !== String(oid));
        setRows(next);
        await tryDeleteOrder(oid);
        setDeleteTarget(null);
    };

    const fmt = (n) => {
        const num = typeof n === "number" ? n : Number(n);
        if (Number.isNaN(num)) return "—";
        return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <AdminPageShell
            kicker="Fulfillment"
            title="Orders"
            description="Create orders, update status, or remove records. Local storage keeps changes when the API is offline."
        >
            <div className="flex justify-end mb-4">
                <button
                    type="button"
                    onClick={openCreate}
                    className={`${tw.btnPrimary} inline-flex items-center gap-2 px-4 py-2.5 text-[11px]`}
                    style={{ background: "linear-gradient(135deg, #ff6b00, #ff0040)", boxShadow: "0 4px 20px rgba(255,107,0,0.25)" }}
                >
                    <FiPlus size={14} /> Add order
                </button>
            </div>

            <div className={`${tw.card} overflow-hidden border border-[#2a1500]`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-[#aa8866]">
                        <thead>
                            <tr className="border-b border-[#2a1500] bg-[#110700]">
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Order
                                </th>
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Customer
                                </th>
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Date
                                </th>
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Items
                                </th>
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Total
                                </th>
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Status
                                </th>
                                <th className="text-right py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e1000]">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-10 text-center text-[#664433]">
                                        Loading…
                                    </td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-10 text-center text-[#664433]">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((o, i) => (
                                    <tr key={String(idOf(o)) + i} className="hover:bg-[#160a00]/80 transition-colors">
                                        <td className="py-3 px-4 text-white font-mono text-xs"><TruncId id={idOf(o)} /></td>
                                        <td className="py-3 px-4 text-white">{emailOf(o)}</td>
                                        <td className="py-3 px-4">{formatDisplayDate(o)}</td>
                                        <td className="py-3 px-4">{itemsOf(o)}</td>
                                        <td className="py-3 px-4 text-[#ff6b00]">{fmt(o.total)}</td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded ${statusClass(o.status)}`}
                                            >
                                                {o.status ?? "—"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(o)}
                                                className="inline-flex items-center gap-1 text-[11px] text-[#ff6b00] hover:text-white mr-3 cursor-pointer bg-transparent border-none p-0"
                                            >
                                                <FiEdit2 size={13} /> Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteTarget(o)}
                                                className="inline-flex items-center gap-1 text-[11px] text-[#ff0040] hover:opacity-80 cursor-pointer bg-transparent border-none p-0"
                                            >
                                                <FiTrash2 size={13} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PaginationControls
                page={page}
                limit={limit}
                total={meta?.total}
                count={rows.length}
                hasMore={rows.length === limit}
                onPageChange={(nextPage) => setPage(Math.max(1, nextPage))}
            />

            {modal && form && (
                <AdminModal
                    title={rows.some((r) => String(idOf(r)) === String(form.id)) ? "Edit order" : "New order"}
                    onClose={() => {
                        setModal(false);
                        setForm(null);
                    }}
                    footer={
                        <>
                            <button type="button" onClick={() => setModal(false)} className={`${tw.btnGhost} py-2 px-4 text-[11px]`}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={saveOrder}
                                className={`${tw.btnPrimary} py-2 px-4 text-[11px]`}
                                style={{ background: "linear-gradient(135deg, #ff6b00, #ff0040)" }}
                            >
                                Save
                            </button>
                        </>
                    }
                >
                    <label className={tw.label}>Order ID</label>
                    <input className={tw.input} value={form.id} disabled readOnly />
                    <label className={tw.label}>Customer email</label>
                    <input
                        type="email"
                        className={tw.input}
                        value={form.customerEmail}
                        onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
                    />
                    <label className={tw.label}>Total (USD)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        className={tw.input}
                        value={form.total}
                        onChange={(e) => setForm((f) => ({ ...f, total: parseFloat(e.target.value) || 0 }))}
                    />
                    <label className={tw.label}>Line items (count)</label>
                    <input
                        type="number"
                        min="0"
                        className={tw.input}
                        value={form.items}
                        onChange={(e) => setForm((f) => ({ ...f, items: parseInt(e.target.value, 10) || 0 }))}
                    />
                    <label className={tw.label}>Placed at</label>
                    <input
                        type="date"
                        className={tw.input}
                        value={form.placedAt ?? ""}
                        onChange={(e) => setForm((f) => ({ ...f, placedAt: e.target.value }))}
                    />
                    <label className={tw.label}>Status</label>
                    <select
                        className={tw.select}
                        value={form.status}
                        onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </AdminModal>
            )}

            {deleteTarget && (
                <AdminConfirmDialog
                    title="Delete order?"
                    message={`Remove order ${idOf(deleteTarget)}?`}
                    confirmLabel="Delete"
                    danger
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </AdminPageShell>
    );
}
