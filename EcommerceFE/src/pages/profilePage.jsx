import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiUser, FiMail, FiPhone, FiMapPin, FiEdit2,
    FiSave, FiX, FiShoppingBag, FiHeart,
    FiLock, FiTrash2, FiCamera, FiChevronRight,
} from "react-icons/fi";
import { usePageTitle } from "../hooks/usePageTitle";
import { useUser } from "../hooks/useUser";
import { gradients, shadows, keyframes, tw } from "../assets/theme";

/* ── Section card wrapper ── */
function Section({ title, children }) {
    return (
        <div className={`${tw.cardPadded} flex flex-col gap-5`}>
            <h2 className="heading text-xl text-white">{title}</h2>
            {children}
        </div>
    );
}

/* ── Editable field row ── */
function Field({ icon: Icon, label, value, editing, name, onChange, type = "text", placeholder }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className={tw.label}>{label}</label>
            <div className="relative flex items-center">
                <Icon size={14} className="absolute left-3.5 text-[#664433] flex-shrink-0" />
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    readOnly={!editing}
                    className={`${tw.input} pl-9 ${!editing ? "cursor-default opacity-70" : ""}`}
                />
            </div>
        </div>
    );
}

/* ── Stat card ── */
function StatCard({ icon: Icon, label, value, color = "#ff6b00" }) {
    return (
        <div className="bg-[#110700] border border-[#1e1000] rounded-xl p-4 flex items-center gap-4">
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18`, border: `1px solid ${color}33` }}
            >
                <Icon size={16} style={{ color }} />
            </div>
            <div>
                <p className="heading text-2xl text-white leading-none">{value}</p>
                <p className="text-[11px] text-[#664433] mt-1 tracking-wide">{label}</p>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function ProfilePage() {
    usePageTitle("My Profile");
    const navigate = useNavigate();
    const { user, isLoggedIn, logout } = useUser();

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [form, setForm] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        address: user?.address ?? "",
        city: user?.city ?? "",
        country: user?.country ?? "United States",
    });

    const [passwords, setPasswords] = useState({
        current: "", newPwd: "", confirm: "",
    });

    const [pwError, setPwError] = useState("");
    const [pwSuccess, setPwSuccess] = useState(false);

    const fileInputRef = useRef(null);

    /* Guard — redirect if not logged in */
    if (!isLoggedIn) {
        navigate("/login");
        return null;
    }

    const initials = (() => {
        const fn = form.firstName?.[0] ?? "";
        const ln = form.lastName?.[0] ?? "";
        return (fn + ln).toUpperCase() || user?.email?.[0]?.toUpperCase() || "?";
    })();

    const handleChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        setSaving(true);
        // TODO: call updateProfileApi(form) when backend is ready
        await new Promise((r) => setTimeout(r, 800)); // simulate API
        const fullName = `${form.firstName} ${form.lastName}`.trim();
        const updated = { ...user, fullName, email: form.email, phone: form.phone };
        localStorage.setItem("user", JSON.stringify(updated));
        setSaving(false);
        setEditing(false);
    };

    const handleCancel = () => {
        setForm({
            firstName: user?.fullName?.split(" ")[0] ?? "",
            lastName: user?.fullName?.split(" ").slice(1).join(" ") ?? "",
            email: user?.email ?? "",
            phone: user?.phone ?? "",
            address: user?.address ?? "",
            city: user?.city ?? "",
            country: user?.country ?? "United States",
        });
        setEditing(false);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPwError("");
        if (passwords.newPwd.length < 8) { setPwError("Password must be at least 8 characters."); return; }
        if (passwords.newPwd !== passwords.confirm) { setPwError("Passwords do not match."); return; }
        setSaving(true);
        // TODO: call changePasswordApi(passwords.current, passwords.newPwd)
        await new Promise((r) => setTimeout(r, 800));
        setSaving(false);
        setPwSuccess(true);
        setPasswords({ current: "", newPwd: "", confirm: "" });
        setTimeout(() => setPwSuccess(false), 3000);
    };

    const TABS = [
        { id: "profile", label: "Profile", icon: FiUser },
        { id: "security", label: "Security", icon: FiLock },
    ];

    return (
        <div className="min-h-screen bg-[#0d0800]">
            <style>{keyframes}</style>

            <div className="max-w-5xl mx-auto px-6 py-12">

                {/* ── Page header ── */}
                <div className="mb-8">
                    <p className={`${tw.labelOrange} mb-1`}>Account</p>
                    <h1 className="heading text-5xl text-white">MY PROFILE</h1>
                </div>

                <div className="grid gap-6" style={{ gridTemplateColumns: "280px 1fr" }}>

                    {/* ══ LEFT SIDEBAR ══ */}
                    <div className="flex flex-col gap-4">

                        {/* Avatar card */}
                        <div className={`${tw.cardPadded} flex flex-col items-center text-center gap-4`}>
                            <div className="relative">
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center heading text-3xl text-white"
                                    style={{ background: gradients.brand, boxShadow: shadows.stepActive }}
                                >
                                    {initials}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-[#0d0800] flex items-center justify-center transition-all hover:scale-110"
                                    style={{ background: gradients.brand }}
                                >
                                    <FiCamera size={12} className="text-white" />
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
                            </div>

                            <div>
                                <p className="text-base font-semibold text-white">
                                    {form.firstName} {form.lastName}
                                </p>
                                <p className="text-xs text-[#664433] mt-0.5">{form.email}</p>
                                {user?.role && (
                                    <span className="inline-block mt-2 text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-[#ff6b0015] text-[#ff6b00] border border-[#ff6b0033]">
                                        {user.role}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-col gap-2.5">
                            <StatCard icon={FiShoppingBag} label="Total Orders" value="0" color="#ff6b00" />
                            <StatCard icon={FiHeart} label="Wishlist Items" value="0" color="#ff0040" />
                        </div>

                        {/* Nav tabs */}
                        <div className={`${tw.card} overflow-hidden`}>
                            {TABS.map(({ id, label, icon: Icon }) => {
                                const active = activeTab === id;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
                                        style={{
                                            background: active ? "#1e0a00" : "transparent",
                                            color: active ? "#ff6b00" : "#664433",
                                            borderLeft: active ? "2px solid #ff6b00" : "2px solid transparent",
                                        }}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Icon size={13} />
                                            {label}
                                        </div>
                                        {active && <FiChevronRight size={12} />}
                                    </button>
                                );
                            })}

                            {/* Logout */}
                            <div className="border-t border-[#1e1000]">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold tracking-widest uppercase text-[#ff0040] hover:bg-[#1a0005] transition-colors"
                                    style={{ borderLeft: "2px solid transparent" }}
                                >
                                    <FiX size={13} />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ══ RIGHT CONTENT ══ */}
                    <div className="flex flex-col gap-4">

                        {/* ── Tab: Profile ── */}
                        {activeTab === "profile" && (
                            <>
                                <Section title="PERSONAL INFORMATION">

                                    {/* Edit / Save toolbar */}
                                    <div className="flex justify-end gap-2 -mt-2">
                                        {editing ? (
                                            <>
                                                <button
                                                    onClick={handleCancel}
                                                    className={`${tw.btnGhost} flex items-center gap-1.5 py-2 px-4 text-[11px]`}
                                                >
                                                    <FiX size={12} /> Cancel
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    disabled={saving}
                                                    className={`${tw.btnPrimary} flex items-center gap-1.5 py-2 px-4 text-[11px] disabled:opacity-60`}
                                                    style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}
                                                >
                                                    {saving ? (
                                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-[spin_0.7s_linear_infinite]" />
                                                    ) : (
                                                        <FiSave size={12} />
                                                    )}
                                                    {saving ? "Saving…" : "Save"}
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setEditing(true)}
                                                className={`${tw.btnGhost} flex items-center gap-1.5 py-2 px-4 text-[11px]`}
                                            >
                                                <FiEdit2 size={12} /> Edit Profile
                                            </button>
                                        )}
                                    </div>

                                    {/* Name row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field icon={FiUser} label="First Name" name="firstName" value={form.firstName} onChange={handleChange} editing={editing} placeholder="John" />
                                        <Field icon={FiUser} label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} editing={editing} placeholder="Doe" />
                                    </div>

                                    <Field icon={FiMail} label="Email" name="email" value={form.email} onChange={handleChange} editing={editing} type="email" placeholder="your@email.com" />
                                    <Field icon={FiPhone} label="Phone" name="phone" value={form.phone} onChange={handleChange} editing={editing} type="tel" placeholder="+1 (555) 000-0000" />
                                </Section>

                                <Section title="SHIPPING ADDRESS">
                                    <Field icon={FiMapPin} label="Street Address" name="address" value={form.address} onChange={handleChange} editing={editing} placeholder="123 Main Street" />

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field icon={FiMapPin} label="City" name="city" value={form.city} onChange={handleChange} editing={editing} placeholder="New York" />
                                        <div className="flex flex-col gap-1.5">
                                            <label className={tw.label}>Country</label>
                                            <select
                                                name="country"
                                                value={form.country}
                                                onChange={handleChange}
                                                disabled={!editing}
                                                className={`${tw.select} ${!editing ? "opacity-70 cursor-default" : ""}`}
                                            >
                                                <option value="United States">United States</option>
                                                <option value="Canada">Canada</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="Australia">Australia</option>
                                                <option value="Vietnam">Vietnam</option>
                                                <option value="Singapore">Singapore</option>
                                                <option value="Japan">Japan</option>
                                                <option value="South Korea">South Korea</option>
                                            </select>
                                        </div>
                                    </div>
                                </Section>

                                {/* Danger zone */}
                                <div className="bg-[#1a0005] border border-[#ff004033] rounded-2xl p-6">
                                    <h2 className="heading text-lg text-[#ff0040] mb-2">DANGER ZONE</h2>
                                    <p className="text-xs text-[#664433] mb-4 leading-relaxed">
                                        Once you delete your account, there is no going back. All your data will be permanently removed.
                                    </p>
                                    {!showDeleteConfirm ? (
                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase text-[#ff0040] border border-[#ff004044] bg-transparent hover:bg-[#ff00400f] transition-colors cursor-pointer"
                                        >
                                            <FiTrash2 size={13} />
                                            Delete Account
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <p className="text-xs text-[#ff0040] flex-1">Are you sure? This cannot be undone.</p>
                                            <button
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="px-3 py-2 rounded-lg text-xs text-[#664433] border border-[#2a1500] bg-transparent hover:border-[#ff6b00] hover:text-[#ff6b00] transition-colors cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="px-3 py-2 rounded-lg text-xs font-bold text-white bg-[#ff0040] border-none cursor-pointer hover:opacity-80 transition-opacity"
                                            >
                                                Confirm Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* ── Tab: Security ── */}
                        {activeTab === "security" && (
                            <Section title="CHANGE PASSWORD">
                                <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className={tw.label}>Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={passwords.current}
                                            onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                                            className={tw.input}
                                            required
                                        />
                                    </div>

                                    <div className={tw.divider} />

                                    <div className="flex flex-col gap-1.5">
                                        <label className={tw.label}>New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Min. 8 characters"
                                            value={passwords.newPwd}
                                            onChange={(e) => setPasswords((p) => ({ ...p, newPwd: e.target.value }))}
                                            className={tw.input}
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className={tw.label}>Confirm New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Repeat new password"
                                            value={passwords.confirm}
                                            onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                                            className={tw.input}
                                            required
                                        />
                                    </div>

                                    {/* Password strength indicator */}
                                    {passwords.newPwd.length > 0 && (
                                        <div className="flex flex-col gap-1.5">
                                            <p className={tw.label}>Password Strength</p>
                                            <div className="flex gap-1.5">
                                                {[1, 2, 3, 4].map((level) => {
                                                    const strength = passwords.newPwd.length >= 12 ? 4
                                                        : passwords.newPwd.length >= 10 ? 3
                                                            : passwords.newPwd.length >= 8 ? 2
                                                                : 1;
                                                    const colors = ["#ff0040", "#ff6b00", "#ffaa00", "#4ade80"];
                                                    return (
                                                        <div
                                                            key={level}
                                                            className="flex-1 h-1 rounded-full transition-all"
                                                            style={{ background: level <= strength ? colors[strength - 1] : "#1e1000" }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                            <p className="text-[11px] text-[#664433]">
                                                {passwords.newPwd.length < 8 ? "Too short" :
                                                    passwords.newPwd.length < 10 ? "Fair" :
                                                        passwords.newPwd.length < 12 ? "Good" : "Strong"}
                                            </p>
                                        </div>
                                    )}

                                    {/* Error / success */}
                                    {pwError && (
                                        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#1a0005] border border-[#ff004033]">
                                            <span className="text-[#ff0040]">⚠</span>
                                            <p className="text-xs text-[#ff0040]">{pwError}</p>
                                        </div>
                                    )}
                                    {pwSuccess && (
                                        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#0d1a00] border border-[#4ade8033]">
                                            <span className="text-green-400">✓</span>
                                            <p className="text-xs text-green-400">Password updated successfully.</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className={`${tw.btnPrimary} w-full py-3.5 flex items-center justify-center gap-2.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed`}
                                        style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}
                                    >
                                        {saving ? (
                                            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-[spin_0.7s_linear_infinite]" />
                                        ) : (
                                            <FiLock size={13} />
                                        )}
                                        {saving ? "Updating…" : "Update Password"}
                                    </button>
                                </form>
                            </Section>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}