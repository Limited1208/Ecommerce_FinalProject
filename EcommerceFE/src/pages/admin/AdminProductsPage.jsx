import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiExternalLink, FiPlus, FiTrash2 } from "react-icons/fi";
import { usePageTitle } from "../../hooks/usePageTitle";
import {
    persistProducts,
    tryDeleteProduct,
    defaultNewProduct,
    fetchAdminProducts,
    getCategoryOptions,
    createProduct,
} from "../../api/adminApi";
import { tw } from "../../assets/theme";
import AdminPageShell from "../../components/admin/AdminPageShell";
import AdminConfirmDialog from "../../components/admin/AdminConfirmDialog";
import AdminProductModal from "../../components/admin/AdminProductModal";



export function buildProductPayload(form) {
    return {
      name:        form.name?.trim()        ?? "",
      sku:         form.sku?.trim()         ?? "",
      description: form.description?.trim() ?? "",
      price:       Number(form.price)       || 0,
      originPrice: form.originPrice         ? Number(form.originPrice) : null,
      stock:       Number(form.stock)       || 0,
      imageUrl:    form.imageUrl?.trim()    ?? "",
      status:      form.status              ?? "InStock",
      care:        form.care?.trim()        ?? "",
      material:    form.material?.trim()    ?? "",
      variant:     form.variant?.trim()     ?? "",
      badge:       form.badge?.trim()       || null,
      gender:      form.gender              ?? "Men",
      categoryId:  form.categoryId          ?? "",
    };
  }

export default function AdminProductsPage() {
    usePageTitle("Admin · Products");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState(null);

    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
        getCategoryOptions().then((data) => {
            setCategoryOptions(data);
        });
    }, []);

    const reload = useCallback(() => {
        fetchAdminProducts().then((data) => {
            setRows(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    const fmt = (n) =>
        typeof n === "number"
            ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : "—";

    const openCreate = () => {
        const draft = defaultNewProduct();
        setForm(draft);
        setModal("edit");
    };

    const openEdit = (p) => {
        setForm({ ...p });
        setModal("edit");
    };


    const saveProduct = async () => {
        if (!form) return;
    
        try {
            if (form.id) {
                // UPDATE
                await persistProducts(form.id, buildProductPayload(form));
            } else {
                // CREATE
                console.log(form)
                await createProduct(buildProductPayload(form));
            }
    
            await reload(); // ✅ always reload from backend
            setModal(null);
            setForm(null);
        } catch (err) {
            console.error(err);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        const id = deleteTarget.id;
        const next = rows.filter((r) => r.id !== id);
        setRows(next);
        await tryDeleteProduct(id);
        console.log(id);
        await persistProducts(next);
        setDeleteTarget(null);
    };

    return (
        <AdminPageShell
            kicker="Catalog"
            title="Products"
            description="Add, edit, or remove products. Changes are saved locally if the API is unavailable."
        >
            <div className="flex justify-end mb-4">
                <button
                    type="button"
                    onClick={openCreate}
                    className={`${tw.btnPrimary} inline-flex items-center gap-2 px-4 py-2.5 text-[11px]`}
                    style={{ background: "linear-gradient(135deg, #ff6b00, #ff0040)", boxShadow: "0 4px 20px rgba(255,107,0,0.25)" }}
                >
                    <FiPlus size={14} /> Add product
                </button>
            </div>

            <div className={`${tw.card} overflow-hidden border border-[#2a1500]`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-[#aa8866]">
                        <thead>
                            <tr className="border-b border-[#2a1500] bg-[#110700]">
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold w-14">
                                    ID
                                </th>
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Product
                                </th>
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Category
                                </th>
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Price
                                </th>
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Badge
                                </th>
                                <th className="text-right py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e1000]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-[#664433]">
                                        Loading…
                                    </td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-[#664433]">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((p, index) => (
                                    <tr key={p.id ?? `row-${index}`} className="hover:bg-[#160a00]/80 transition-colors">
                                        <td className="py-3 px-4 text-white font-mono text-xs">{p.id}</td>
                                        <td className="py-3 px-4 text-white">{p.name}</td>
                                        <td className="py-3 px-4">{p.category ?? "—"}</td>
                                        <td className="py-3 px-4 text-[#ff6b00]">{fmt(p.price)}</td>
                                        <td className="py-3 px-4">
                                            {p.badge ? (
                                                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#2a1500] text-white">
                                                    {p.badge}
                                                </span>
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right whitespace-nowrap">
                                            <Link
                                                to={`/product/${p.id}`}
                                                className="inline-flex items-center gap-1 text-[11px] text-[#664433] hover:text-[#ff6b00] transition-colors no-underline mr-3"
                                            >
                                                View <FiExternalLink size={12} />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => openEdit(p)}
                                                className="inline-flex items-center gap-1 text-[11px] text-[#ff6b00] hover:text-white mr-3 cursor-pointer bg-transparent border-none p-0"
                                            >
                                                <FiEdit2 size={13} /> Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteTarget(p)}
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

            {modal === "edit" && form && (
                <AdminProductModal
                    form={form}
                    setForm={setForm}
                    isEdit={rows.some((r) => r.id === form.id)}
                    onClose={() => { setModal(null); setForm(null); }}
                    onSave={saveProduct}
                    categoryOptions={categoryOptions}
                />
            )}

            {deleteTarget && (
                <AdminConfirmDialog
                    title="Delete product?"
                    message={`Remove “${deleteTarget.name}” from the catalog? This cannot be undone on the server unless you restore from backup.`}
                    confirmLabel="Delete"
                    danger
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </AdminPageShell>
    );
}
