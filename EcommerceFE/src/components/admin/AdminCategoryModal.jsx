import { gradients, shadows, tw } from "../../assets/theme";
import ImageUpload from "../ImageUpload";
import AdminModal from "./AdminModal";

/* ── Auto-generate slug from name ── */
function toSlug(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export default function AdminCategoryModal({ form, setForm, isEdit, onClose, onSave }) {

    const setF = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleNameChange = (e) => {
        const name = e.target.value;
        setForm((f) => ({
            ...f,
            name,
            // Auto-fill slug only if user hasn't manually edited it
            slug: f._slugEdited ? f.slug : toSlug(name),
        }));
    };

    const handleSlugChange = (e) => {
        setForm((f) => ({
            ...f,
            slug: e.target.value,
            _slugEdited: true,   // mark as manually edited — stop auto-fill
        }));
    };

    return (
        <AdminModal
            title={isEdit ? "Edit Category" : "New Category"}
            onClose={onClose}
            footer={
                <>
                    <button type="button" onClick={onClose}
                        className={`${tw.btnGhost} py-2 px-4 text-[11px]`}>
                        Cancel
                    </button>
                    <button type="button" onClick={onSave}
                        className="py-2 px-5 rounded-lg text-[11px] font-bold tracking-widest uppercase text-white cursor-pointer border-none hover:scale-[1.02] transition-all"
                        style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}>
                        Save
                    </button>
                </>
            }
        >
            <div className="flex flex-col gap-4">

                {/* name */}
                <div className="flex flex-col gap-1.5">
                    <label className={tw.label}>Name <span className="text-[#ff0040]">*</span></label>
                    <input
                        className={tw.input}
                        placeholder="Electronics"
                        value={form.name ?? ""}
                        onChange={handleNameChange}
                        required
                    />
                </div>

                {/* slug — auto from name, editable */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label className={tw.label}>slug</label>
                        {form._slugEdited && (
                            <button
                                type="button"
                                onClick={() => setForm((f) => ({ ...f, slug: toSlug(f.name ?? ""), _slugEdited: false }))}
                                className="text-[10px] text-[#ff6b00] hover:opacity-70 bg-transparent border-none cursor-pointer p-0 transition-opacity"
                            >
                                ↺ Reset from name
                            </button>
                        )}
                    </div>
                    <input
                        className={tw.input}
                        placeholder="electronics"
                        value={form.slug ?? ""}
                        onChange={handleSlugChange}
                    />
                    <p className="text-[10px] text-[#664433]">Auto-generated from name. Lowercase, hyphens only.</p>
                </div>

                {/* description */}
                <div className="flex flex-col gap-1.5">
                    <label className={tw.label}>Description</label>
                    <textarea
                        rows={3}
                        className={`${tw.input} resize-none`}
                        placeholder="Devices and gadgets including phones, laptops, and accessories"
                        value={form.description ?? ""}
                        onChange={setF("description")}
                    />
                </div>

                {/* imageUrl + preview */}
                <div className="flex flex-col gap-1.5">
                    <ImageUpload 
                        value={form.imageUrl}
                        onChange={(url, file) => 
                            setF((f) => ({
                                ...f,
                                imageUrl: url,
                                file,
                            }))
                        }
                    />
                </div>

                {/* isActive toggle */}
                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#2a1500] bg-[#0d0800]">
                    <div>
                        <p className="text-sm text-white font-medium">isActive</p>
                        <p className="text-[11px] text-[#664433] mt-0.5">Inactive categories are hidden from the storefront.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                        className="relative w-10 h-5.5 rounded-full flex-shrink-0 transition-all cursor-pointer border-none p-0"
                        style={{
                            width: 40,
                            height: 22,
                            background: form.isActive ? gradients.brand : "#2a1500",
                            boxShadow: form.isActive ? "0 0 10px rgba(255,107,0,0.3)" : "none",
                        }}
                    >
                        <span
                            className="absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white transition-all"
                            style={{
                                left: form.isActive ? "calc(100% - 20px)" : 2,
                            }}
                        />
                    </button>
                </div>

            </div>
        </AdminModal>
    );
}