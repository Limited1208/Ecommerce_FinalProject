import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { usePageTitle } from "../../hooks/usePageTitle";
import {
    persistUsers,
    tryDeleteUser,
    fetchAdminUsers,
} from "../../api/adminApi";
import { tw } from "../../assets/theme";
import { TruncId } from "../../components/functions/truncId";
import AdminPageShell from "../../components/admin/AdminPageShell";
import AdminModal from "../../components/admin/AdminModal";
import AdminConfirmDialog from "../../components/admin/AdminConfirmDialog";
import SearchBar from "../../components/admin/SearchBar";

function displayName(u) {
    if (u.firstName || u.lastName) {
        return [u.firstName, u.lastName].filter(Boolean).join(" ");
    }
    return u.name ?? u.fullName ?? "—";
}

export default function AdminUsersPage() {
    usePageTitle("Admin · Users");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState(null);
    const [search, setSearch] = useState("");

    const reload = useCallback(() => {
        fetchAdminUsers().then((data) => {
            setRows(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    const openCreate = () => {
        setForm({
            id: 0,
            email: "",
            firstName: "",
            lastName: "",
            role: "customer",
            createdAt: new Date().toISOString().slice(0, 10),
        });
        setModal(true);
    };

    const openEdit = (u) => {
        setForm({ ...u });
        setModal(true);
    };

    const filtered = rows.filter((u) => {
        const keyword = search.toLowerCase();
        return (
            u.email?.toLowerCase().includes(keyword) ||
            displayName(u).toLowerCase().includes(keyword) ||
            String(u.id).includes(keyword) ||
            (u.role ?? "").toLowerCase().includes(keyword)
        );
    });


    const saveUser = async () => {
        if (!form?.email?.trim()) return;
        const exists = rows.some((r) => r.id === form.id);
        const next = exists ? rows.map((r) => (r.id === form.id ? { ...form } : r)) : [...rows, { ...form }];
        setRows(next);
        await persistUsers(form.id, next);
        setModal(false);
        setForm(null);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        const id = deleteTarget.id;
        const next = rows.filter((r) => r.id !== id);
        setRows(next);
        await tryDeleteUser(id);
        await persistUsers(next);
        setDeleteTarget(null);
    };

    return (
        <AdminPageShell
            kicker="Accounts"
            title="Users"
            description="Manage customer accounts. Data syncs to the API when endpoints exist; otherwise it stays in this browser."
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search name, id, email…"
                />
                <div className="flex justify-end mb-4">
                    <button
                        type="button"
                        onClick={openCreate}
                        className={`${tw.btnPrimary} inline-flex items-center gap-2 px-4 py-2.5 text-[11px]`}
                        style={{ background: "linear-gradient(135deg, #ff6b00, #ff0040)", boxShadow: "0 4px 20px rgba(255,107,0,0.25)" }}
                    >
                        <FiPlus size={14} /> Add user
                    </button>
                </div>
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
                                    Email
                                </th>
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Name
                                </th>
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Role
                                </th>
                                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#664433] font-bold">
                                    Joined
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
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((u) => (
                                    <tr key={u.id} className="hover:bg-[#160a00]/80 transition-colors">
                                        <td className="py-3 px-4 w-20"><TruncId id={u.id} /></td>
                                        <td className="py-3 px-4 text-white">{u.email}</td>
                                        <td className="py-3 px-4">{displayName(u)}</td>
                                        <td className="py-3 px-4">
                                            <span className="capitalize">{u.role ?? "customer"}</span>
                                        </td>
                                        <td className="py-3 px-4 text-[#664433]">
                                            {u.createdAt ?? u.joinedAt ?? "—"}
                                        </td>
                                        <td className="py-3 px-4 text-right whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(u)}
                                                className="inline-flex items-center gap-1 text-[11px] text-[#ff6b00] hover:text-white mr-3 cursor-pointer bg-transparent border-none p-0"
                                            >
                                                <FiEdit2 size={13} /> Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteTarget(u)}
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

            {modal && form && (
                <AdminModal
                    title={rows.some((r) => r.id === form.id) ? "Edit user" : "New user"}
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
                                onClick={saveUser}
                                className={`${tw.btnPrimary} py-2 px-4 text-[11px]`}
                                style={{ background: "linear-gradient(135deg, #ff6b00, #ff0040)" }}
                            >
                                Save
                            </button>
                        </>
                    }
                >
                    <label className={tw.label}>Email</label>
                    <input
                        type="email"
                        className={tw.input}
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        required
                    />
                    <label className={tw.label}>First name</label>
                    <input
                        className={tw.input}
                        value={form.firstName ?? ""}
                        onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    />
                    <label className={tw.label}>Last name</label>
                    <input
                        className={tw.input}
                        value={form.lastName ?? ""}
                        onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    />
                    <label className={tw.label}>Role</label>
                    <select
                        className={tw.select}
                        value={form.role ?? "customer"}
                        onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    >
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                    </select>
                </AdminModal>
            )}

            {deleteTarget && (
                <AdminConfirmDialog
                    title="Delete user?"
                    message={`Remove ${deleteTarget.email}?`}
                    confirmLabel="Delete"
                    danger
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </AdminPageShell>
    );
}
