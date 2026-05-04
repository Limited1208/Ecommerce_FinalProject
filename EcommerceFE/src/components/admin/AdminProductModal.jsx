import { gradients, shadows, tw } from "../../assets/theme";
import ImageUpload from "../ImageUpload";
import AdminModal from "./AdminModal";


export default function AdminProductModal({ form, setForm, isEdit, onClose, onSave, categoryOptions = [] }) {

  const setF = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setNum = (key) => (e) => setForm((f) => ({ ...f, [key]: parseFloat(e.target.value) || 0 }));
  const setInt = (key) => (e) => setForm((f) => ({ ...f, [key]: parseInt(e.target.value) || 0 }));

  return (
    <AdminModal
      title={isEdit ? "Edit Product" : "New Product"}
      onClose={onClose}
      wide
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
      <div className="flex flex-col gap-5">

        {/* name + sku */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={tw.label}>Name <span className="text-[#ff0040]">*</span></label>
            <input className={tw.input} placeholder="T-Shirt Basic"
              value={form.name ?? ""} onChange={setF("name")} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={tw.label}>SKU</label>
            <input className={tw.input} placeholder="SKU-12345"
              value={form.sku ?? ""} onChange={setF("sku")} required />
          </div>
        </div>

        {/* description */}
        <div className="flex flex-col gap-1.5">
          <label className={tw.label}>Description</label>
          <textarea rows={3} className={`${tw.input} resize-none`}
            placeholder="High quality cotton t-shirt…"
            value={form.description ?? ""} onChange={setF("description")} />
        </div>

        {/* price + originPrice + stock */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={tw.label}>Price <span className="text-[#ff0040]">*</span></label>
            <input type="number" step="0.01" min="0" className={tw.input} placeholder="19.99"
              value={form.price ?? ""} onChange={setNum("price")} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={tw.label}>originPrice</label>
            <input type="number" step="0.01" min="0" className={tw.input} placeholder="29.99"
              value={form.originPrice ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, originPrice: parseFloat(e.target.value) || null }))} />
          </div>
        </div>

        {/* categoryId + gender + status */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={tw.label}>category <span className="text-[#ff0040]">*</span></label>
            <select className={tw.select}
              value={form.categoryId ?? ""} required
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
              <option value="">— Select —</option>
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={tw.label}>gender</label>
            <select className={tw.select} value={form.gender ?? "Men"} onChange={setF("gender")}>
              <option value="Kid">Kid</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={tw.label}>status</label>
            <select className={tw.select} value={form.status ?? "InStock"} onChange={setF("status")}>
              <option value="InStock">InStock</option>
              <option value="OutOfStock">OutOfStock</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="DRAFT">DRAFT</option>
            </select>
          </div>
        </div>

        {/* badge + variant */}
        <div className="flex flex-col gap-1.5">
          <label className={tw.label}>badge</label>
          <select
            className={tw.select}
            value={form.badge ?? "New"}
            onChange={setF("badge")}
          >
            <option value="BestSeller">BestSeller</option>
            <option value="New">New</option>
            <option value="Sale">Sale</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={tw.label}>Sizes</label>
          <input
            className={tw.input}
            placeholder="S,M,L"
            value={(form.sizes || []).join(",")}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                sizes: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className={tw.label}>Variants</label>

          {(form.variants || []).map((v, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <input
                className={tw.input}
                placeholder="Size"
                value={v.size}
                onChange={(e) => {
                  const arr = [...form.variants];
                  arr[i].size = e.target.value;
                  setForm((f) => ({ ...f, variants: arr }));
                }}
              />
              <input
                className={tw.input}
                placeholder="Color"
                value={v.color}
                onChange={(e) => {
                  const arr = [...form.variants];
                  arr[i].color = e.target.value;
                  setForm((f) => ({ ...f, variants: arr }));
                }}
              />
              <input
                type="number"
                className={tw.input}
                placeholder="Stock"
                value={v.stock ?? 0}
                onChange={(e) => {
                  const arr = [...form.variants];
                  arr[i].stock = parseInt(e.target.value) || 0;
                  setForm((f) => ({ ...f, variants: arr }));
                }}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setForm((f) => ({
                ...f,
                variants: [...(f.variants || []), { size: "", color: "", stock: 0 }],
              }))
            }
            className={tw.btnGhost}
          >
            + Add Variant
          </button>
        </div>

        {/* imageUrl + preview */}
        <div className="flex flex-col gap-2">
          <ImageUpload
            value={form.imageUrl}
            onChange={(url, file) =>
              setForm((f) => ({
                ...f,
                imageUrl: url,
                file,
              }))
            }
          />

        </div>

        {/* material + care */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={tw.label}>material</label>
            <input className={tw.input} placeholder="Cotton 100%"
              value={form.material ?? ""} onChange={setF("material")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={tw.label}>care</label>
            <input className={tw.input} placeholder="Wash cold, do not bleach"
              value={form.care ?? ""} onChange={setF("care")} />
          </div>
        </div>

      </div>
    </AdminModal>
  );
}