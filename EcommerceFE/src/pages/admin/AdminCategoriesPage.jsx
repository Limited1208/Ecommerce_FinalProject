import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { usePageTitle } from "../../hooks/usePageTitle";
import {
    persistCategories,
    tryDeleteCategory,
    fetchAdminProducts,
    fetchAdminCategories,
    createCategory,
} from "../../api/adminApi";
import { tw } from "../../assets/theme";
import AdminPageShell from "../../components/admin/AdminPageShell";
import AdminModal from "../../components/admin/AdminModal";
import AdminConfirmDialog from "../../components/admin/AdminConfirmDialog";
import AdminCategoryModal from "../../components/admin/AdminCategoryModal";

function slugify(name) {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

export default function AdminCategoriesPage() {
    usePageTitle("Admin · Categories");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState(null);
    const [productList, setProductList] = useState([]);

    const reload = useCallback(() => {
        fetchAdminCategories().then((data) => {
            setRows(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        fetchAdminProducts().then(setProductList);
        reload();
    }, [reload]);

    const nameOf = (row) => row.name ?? row.title ?? row.label ?? "—";
    const rowSlug = (row) => row.slug ?? slugify(nameOf(row));

    const openCreate = () => {
        setForm({ name: "", slug: "" });
        setModal(true);
    };

    const openEdit = (row) => {
        const n = nameOf(row);
        setForm({
            id: row.id,
            name: n,
            description: row.description || "",
            slug: row.slug ?? slugify(n),
            imageUrl: row.imageUrl || "",
            _prevSlug: rowSlug(row),
        });
        setModal(true);
    };

    const saveCategory = async () => {
    if (!form?.name?.trim()) return;

    const name = form.name.trim();
    const slug = (form.slug || slugify(name)).trim();

    const payload = {
        name,
        description: form.description || "",
        slug,
        imageUrl: form.imageUrl || "",
        isActive: form.isActive ?? true,
    };

    try {
        let updated;

        if (form.id) {
            await persistCategories(form.id, payload);

            updated = rows.map((r) =>
                r.id === form.id ? { ...r, ...payload } : r
            );
        } else {
            const newCat = await createCategory(payload);

            updated = [...rows, newCat];
        }

        setRows(updated);
        setModal(false);
        setForm(null);
    } catch (err) {
        console.error(err);
    }
};

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        const slug = rowSlug(deleteTarget);
        const next = rows.filter((r) => rowSlug(r) !== slug);
        setRows(next);
        await tryDeleteCategory(slug);
        await persistCategories(next);
        setDeleteTarget(null);
    };

    const productsInCategory = deleteTarget
        ? productList.filter((p) => p.category === nameOf(deleteTarget)).length
        : 0;

    return (
        <AdminPageShell
            kicker="Taxonomy"
            title="Categories"
            description="Create and organize categories. Product counts reflect the current catalog (including admin product edits)."
        >
            <div className="flex justify-end mb-4">
                <button
                    type="button"
                    onClick={openCreate}
                    className={`${tw.btnPrimary} inline-flex items-center gap-2 px-4 py-2.5 text-[11px]`}
                    style={{ background: "linear-gradient(135deg, #ff6b00, #ff0040)", boxShadow: "0 4px 20px rgba(255,107,0,0.25)" }}
                >
                    <FiPlus size={14} /> Add category
                </button>
            </div>

            <div className={`${tw.card} overflow-hidden border border-[#2a1500]`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-[#aa8866]">
                        <thead>
                            <tr className="border-b border-[#2a1500] bg-[#110700]">
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Category
                                </th>
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Products
                                </th>
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Slug
                                </th>
                                <th className="text-right py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e1000]">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center text-[#664433]">
                                        Loading…
                                    </td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center text-[#664433]">
                                        No categories.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, i) => {
                                    const name = nameOf(row);
                                    const slug = rowSlug(row);
                                    const count =
                                        row.productCount ?? productList.filter((p) => p.category === name).length;
                                    return (
                                        <tr key={row.id ?? slug ?? i} className="hover:bg-[#160a00]/80 transition-colors">
                                            <td className="py-3 px-4 text-white font-semibold">{name}</td>
                                            <td className="py-3 px-4 text-[#ff6b00]">{count}</td>
                                            <td className="py-3 px-4 font-mono text-xs text-[#664433]">{slug}</td>
                                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(row)}
                                                    className="inline-flex items-center gap-1 text-[11px] text-[#ff6b00] hover:text-white mr-3 cursor-pointer bg-transparent border-none p-0"
                                                >
                                                    <FiEdit2 size={13} /> Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteTarget(row)}
                                                    className="inline-flex items-center gap-1 text-[11px] text-[#ff0040] hover:opacity-80 cursor-pointer bg-transparent border-none p-0"
                                                >
                                                    <FiTrash2 size={13} /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && form && (
                <AdminCategoryModal
                    form={form}
                    setForm={setForm}
                    isEdit={form._prevSlug !== undefined}
                    onClose={() => { setModal(false); setForm(null); }}
                    onSave={saveCategory}
                />
            )}

            {deleteTarget && (
                <AdminConfirmDialog
                    title="Delete category?"
                    message={`Remove “${nameOf(deleteTarget)}”?${productsInCategory > 0
                        ? ` ${productsInCategory} product(s) still use this category label — update those products if you rename or remove it.`
                        : ""
                        }`}
                    confirmLabel="Delete"
                    danger
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </AdminPageShell>
    );
}
