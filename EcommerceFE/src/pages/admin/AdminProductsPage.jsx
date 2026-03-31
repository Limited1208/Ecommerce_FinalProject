import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiExternalLink, FiPlus, FiTrash2, FiSearch, FiPackage } from "react-icons/fi";
import { usePageTitle } from "../../hooks/usePageTitle";
import {
    persistProducts,
    tryDeleteProduct,
    defaultNewProduct,
    fetchAdminProducts,
    getCategoryOptions,
    createProduct,
} from "../../api/adminApi";
import { gradients, shadows } from "../../assets/theme";
import { TruncId } from "../../components/functions/truncId";
import AdminPageShell from "../../components/admin/AdminPageShell";
import AdminConfirmDialog from "../../components/admin/AdminConfirmDialog";
import AdminProductModal from "../../components/admin/AdminProductModal";
import SearchBar from "../../components/admin/SearchBar";

/* ── Build exact API payload ── */
export function buildProductPayload(form) {
    return {
        name: form.name?.trim() ?? "",
        sku: form.sku?.trim() ?? "",
        description: form.description?.trim() ?? "",
        price: Number(form.price) || 0,
        originPrice: form.originPrice ? Number(form.originPrice) : null,
        stock: Number(form.stock) || 0,
        imageUrl: form.imageUrl?.trim() ?? "",
        status: form.status ?? "InStock",
        care: form.care?.trim() ?? "",
        material: form.material?.trim() ?? "",
        variant: form.variant?.trim() ?? "",
        badge: form.badge?.trim() || null,
        gender: form.gender ?? "Men",
        categoryId: form.categoryId ?? "",
    };
}

/* ── Status badge ── */
const STATUS_MAP = {
    InStock: { label: "In Stock", bg: "rgba(74,222,128,0.12)", color: "#4ade80", border: "rgba(74,222,128,0.25)" },
    OutOfStock: { label: "Out of Stock", bg: "rgba(255,0,64,0.12)", color: "#ff0040", border: "rgba(255,0,64,0.25)" },
    ACTIVE: { label: "Active", bg: "rgba(74,222,128,0.12)", color: "#4ade80", border: "rgba(74,222,128,0.25)" },
    DRAFT: { label: "Draft", bg: "rgba(255,255,255,0.05)", color: "#664433", border: "#2a1500" },
    Discontinued: { label: "Discontinued", bg: "rgba(255,107,0,0.10)", color: "#ff6b00", border: "rgba(255,107,0,0.25)" },
};

function StatusBadge({ status }) {
    const s = STATUS_MAP[status] ?? { label: status ?? "—", bg: "rgba(255,255,255,0.05)", color: "#664433", border: "#2a1500" };
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase whitespace-nowrap"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
        >
            <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: s.color }}
            />
            {s.label}
        </span>
    );
}

/* ── Badge pill ── */
function BadgePill({ badge }) {
    if (!badge) return <span className="text-[#2a1500]">—</span>;
    const colors = {
        BestSeller: { bg: "rgba(255,107,0,0.15)", color: "#ff6b00", border: "rgba(255,107,0,0.3)" },
        New: { bg: "rgba(74,222,128,0.12)", color: "#4ade80", border: "rgba(74,222,128,0.25)" },
        Sale: { bg: "rgba(255,0,64,0.12)", color: "#ff0040", border: "rgba(255,0,64,0.25)" },
    };
    const c = colors[badge] ?? { bg: "rgba(255,255,255,0.05)", color: "#aa8866", border: "#2a1500" };
    return (
        <span
            className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase"
            style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
        >
            {badge}
        </span>
    );
}

/* ── Table header ── */
function Th({ children, right }) {
    return (
        <th className={`py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold ${right ? "text-right" : "text-left"}`}>
            {children}
        </th>
    );
}

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
export default function AdminProductsPage() {
    usePageTitle("Admin · Products");

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
        getCategoryOptions().then(setCategoryOptions);
    }, []);

    const reload = useCallback(() => {
        fetchAdminProducts().then((data) => { setRows(data); setLoading(false); });
    }, []);

    useEffect(() => { reload(); }, [reload]);

    const fmt = (n) =>
        typeof n === "number"
            ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : "—";

    const filtered = rows.filter((p) => {
        const q = search.toLowerCase();
        return !q
            || p.name?.toLowerCase().includes(q)
            || p.sku?.toLowerCase().includes(q)
            || String(p.status ?? "").toLowerCase().includes(q)
            || String(p.category ?? "").toLowerCase().includes(q);
    });

    const openCreate = () => { setForm(defaultNewProduct()); setModal("edit"); };
    const openEdit = (p) => { setForm({ ...p }); setModal("edit"); };
    const closeModal = () => { setModal(null); setForm(null); };

    const saveProduct = async () => {
        if (!form) return;
        try {
            if (form.id) {
                await persistProducts(form.id, buildProductPayload(form));
            } else {
                await createProduct(buildProductPayload(form));
            }
            await reload();
            closeModal();
        } catch (err) {
            console.error(err);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        const next = rows.filter((r) => r.id !== deleteTarget.id);
        setRows(next);
        await tryDeleteProduct(deleteTarget.id);
        await persistProducts(next);
        setDeleteTarget(null);
    };

    return (
        <AdminPageShell
            kicker="Catalog"
            title="Products"
            description="Add, edit, or remove products. Changes are saved locally if the API is unavailable."
        >
            {/* ── Toolbar ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search name, SKU, status…"
                />
                <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-[#664433]">
                        <span className="text-white font-semibold">{filtered.length}</span> products
                    </span>
                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold tracking-widest uppercase text-white cursor-pointer border-none transition-all hover:scale-[1.02]"
                        style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}
                    >
                        <FiPlus size={13} /> Add Product
                    </button>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-[#130900] border border-[#2a1500] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                        <thead>
                            <tr className="border-b border-[#2a1500] bg-[#110700]">
                                <Th>ID</Th>
                                <Th>Product</Th>
                                <Th>Category</Th>
                                <Th>Price</Th>
                                <Th>Badge</Th>
                                <Th>Status</Th>
                                <Th right>Actions</Th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e1000]">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-[#664433] text-sm">
                                        Loading…
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center">
                                        <FiPackage size={28} className="mx-auto mb-2 text-[#2a1500]" />
                                        <p className="text-[#664433] text-sm">{search ? "No products match your search." : "No products yet."}</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((p, i) => (
                                    <tr key={p.id ?? `row-${i}`} className="hover:bg-[#1a0a00] transition-colors">
                                        {/* ID */}
                                        <td className="py-3 px-4 w-20"><TruncId id={p.id} /></td>

                                        {/* Product: image + name + SKU */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                {p.imageUrl ? (
                                                    <img src={p.imageUrl} alt={p.name}
                                                        className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-[#2a1500]"
                                                        onError={(e) => { e.target.style.display = "none"; }} />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-lg bg-[#1e1000] flex items-center justify-center flex-shrink-0">
                                                        <FiPackage size={14} className="text-[#2a1500]" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="text-white text-sm font-medium leading-tight truncate max-w-[160px]">{p.name}</p>
                                                    {p.sku && <p className="text-[#664433] text-[11px] font-mono mt-0.5">{p.sku}</p>}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="py-3 px-4 text-xs text-[#aa8866]">{p.category ?? p.categoryId ?? "—"}</td>

                                        {/* Price */}
                                        <td className="py-3 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-semibold text-sm">{fmt(p.price)}</span>
                                                {p.originPrice && (
                                                    <span className="text-[#664433] text-[11px] line-through">{fmt(p.originPrice)}</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Badge */}
                                        <td className="py-3 px-4"><BadgePill badge={p.badge} /></td>

                                        {/* Status */}
                                        <td className="py-3 px-4"><StatusBadge status={p.status} /></td>

                                        {/* Actions */}
                                        <td className="py-3 px-4 text-right whitespace-nowrap">
                                            <Link to={`/product/${p.id}`}
                                                className="inline-flex items-center gap-1 text-[11px] text-[#664433] hover:text-[#ff6b00] transition-colors no-underline mr-3">
                                                <FiExternalLink size={12} /> View
                                            </Link>
                                            <button type="button" onClick={() => openEdit(p)}
                                                className="inline-flex items-center gap-1 text-[11px] text-[#ff6b00] hover:text-white mr-3 cursor-pointer bg-transparent border-none p-0 transition-colors">
                                                <FiEdit2 size={12} /> Edit
                                            </button>
                                            <button type="button" onClick={() => setDeleteTarget(p)}
                                                className="inline-flex items-center gap-1 text-[11px] text-[#ff0040] hover:opacity-70 cursor-pointer bg-transparent border-none p-0 transition-opacity">
                                                <FiTrash2 size={12} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Modal ── */}
            {modal === "edit" && form && (
                <AdminProductModal
                    form={form}
                    setForm={setForm}
                    isEdit={rows.some((r) => r.id === form.id)}
                    onClose={closeModal}
                    onSave={saveProduct}
                    categoryOptions={categoryOptions}
                />
            )}

            {/* ── Delete confirm ── */}
            {deleteTarget && (
                <AdminConfirmDialog
                    title="Delete product?"
                    message={
                        <span>Remove <span className="text-white font-semibold">"{deleteTarget.name}"</span>? This cannot be undone.</span>
                    }
                    confirmLabel="Delete"
                    danger
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </AdminPageShell>
    );
}