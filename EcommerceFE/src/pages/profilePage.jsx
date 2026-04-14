import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiUser, FiMail, FiPhone, FiMapPin,
    FiEdit2, FiSave, FiX, FiShoppingBag,
    FiLock, FiTrash2, FiCamera,
    FiChevronRight, FiLogOut,
} from "react-icons/fi";
import { usePageTitle } from "../hooks/usePageTitle";
import { useUser } from "../hooks/useUser";
import { gradients, shadows, keyframes, tw } from "../assets/theme";
import { changePasswordApi, deleteAccountApi, getMyOrdersApi } from "../api/userApi";
import FormField from "../components/FormField";
import PasswordInput from "../components/PasswordInput";
import PasswordStrength from "../components/PasswordStrength";
import { ErrorBanner, SuccessBanner } from "../components/AlertBanner";
import LoadingSpinner from "../components/LoadingSpinner";

/* ── Section card ── */
function Section({ title, children }) {
    return (
        <div className={`${tw.cardPadded} flex flex-col gap-5`}>
            <h2 className="heading text-xl text-white">{title}</h2>
            {children}
        </div>
    );
}

/* ── Edit / Save / Cancel toolbar ── */
function EditToolbar({ editing, saving, onEdit, onSave, onCancel }) {
    return (
        <div className="flex justify-end gap-2 -mt-2">
            {editing ? (
                <>
                    <button onClick={onCancel} className={`${tw.btnGhost} flex items-center gap-1.5 py-2 px-4 text-[11px]`}>
                        <FiX size={12} /> Cancel
                    </button>
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className={`${tw.btnPrimary} flex items-center gap-1.5 py-2 px-4 text-[11px] disabled:opacity-60 disabled:cursor-not-allowed`}
                        style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}
                    >
                        {saving ? <LoadingSpinner size={14} /> : <FiSave size={12} />}
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </>
            ) : (
                <button onClick={onEdit} className={`${tw.btnGhost} flex items-center gap-1.5 py-2 px-4 text-[11px]`}>
                    <FiEdit2 size={12} /> Edit
                </button>
            )}
        </div>
    );
}

/* ── Stat card ── */
function StatCard({ icon: Icon, label, value, color = "#ff6b00" }) {
    return (
        <div className="bg-[#110700] border border-[#1e1000] rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
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
   PROFILE PAGE
══════════════════════════════════════ */
export default function ProfilePage() {
    usePageTitle("My Profile");
    const navigate = useNavigate();

    const { user, isLoggedIn, loading: userLoading, error: userError, logout, refreshProfile, updateProfile } = useUser();

    const [activeTab, setActiveTab] = useState("profile");
    const [orderCount, setOrderCount] = useState("");

    /* Personal info */
    const [infoForm, setInfoForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
    const [editingInfo, setEditingInfo] = useState(false);
    const [savingInfo, setSavingInfo] = useState(false);
    const [infoError, setInfoError] = useState("");

    /* Shipping address */
    const [addrForm, setAddrForm] = useState({ address: "", city: "", country: "United States" });
    const [editingAddr, setEditingAddr] = useState(false);
    const [savingAddr, setSavingAddr] = useState(false);
    const [addrError, setAddrError] = useState("");

    /* Password */
    const [passwords, setPasswords] = useState({ current: "", newPwd: "", confirm: "" });
    const [pwError, setPwError] = useState("");
    const [pwSuccess, setPwSuccess] = useState(false);
    const [savingPw, setSavingPw] = useState(false);

    /* Delete */
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const fileInputRef = useRef(null);

    /* Sync form when user loads */
    useEffect(() => {
        if (!user) return;
        setInfoForm({
            firstName: user.firstName ?? user.fullName?.split(" ")[0] ?? "",
            lastName: user.lastName ?? user.fullName?.split(" ").slice(1).join(" ") ?? "",
            email: user.email ?? "",
            phone: user.phone ?? "",
        });
        setAddrForm({
            address: user.address ?? "",
            city: user.city ?? "",
            country: user.country ?? "United States",
        });
    }, [user]);

    useEffect(() => {
        getMyOrdersApi().then((data) => {
            const count = Array.isArray(data) ? data.length : 0;
            setOrderCount(count);
        });
    }, []);

    if (!isLoggedIn) { navigate("/login"); return null; }

    const initials = (() => {
        const fn = infoForm.firstName?.[0] ?? "";
        const ln = infoForm.lastName?.[0] ?? "";
        return (fn + ln).toUpperCase() || user?.email?.[0]?.toUpperCase() || "?";
    })();

    /* Save personal info */
    const handleSaveInfo = async () => {
        setSavingInfo(true); setInfoError("");
        try { await updateProfile(infoForm); setEditingInfo(false); }
        catch (err) { setInfoError(err.response?.data?.message ?? userError ?? "Failed to update profile."); }
        finally { setSavingInfo(false); }
    };

    const handleCancelInfo = () => {
        setInfoForm({
            firstName: user?.firstName ?? user?.fullName?.split(" ")[0] ?? "",
            lastName: user?.lastName ?? user?.fullName?.split(" ").slice(1).join(" ") ?? "",
            email: user?.email ?? "", phone: user?.phone ?? "",
        });
        setInfoError(""); setEditingInfo(false);
    };

    /* Save address */
    const handleSaveAddr = async () => {
        setSavingAddr(true); setAddrError("");
        try { await updateProfile(addrForm); setEditingAddr(false); }
        catch (err) { setAddrError(err.response?.data?.message ?? userError ?? "Failed to update address."); }
        finally { setSavingAddr(false); }
    };

    const handleCancelAddr = () => {
        setAddrForm({ address: user?.address ?? "", city: user?.city ?? "", country: user?.country ?? "United States" });
        setAddrError(""); setEditingAddr(false);
    };

    /* Change password */
    const handlePasswordChange = async (e) => {
        e.preventDefault(); setPwError("");
        if (passwords.newPwd.length < 8) { setPwError("Password must be at least 8 characters."); return; }
        if (passwords.newPwd !== passwords.confirm) { setPwError("Passwords do not match."); return; }
        setSavingPw(true);
        try {
            await changePasswordApi(passwords.current, passwords.newPwd);
            setPwSuccess(true);
            setPasswords({ current: "", newPwd: "", confirm: "" });
            setTimeout(() => setPwSuccess(false), 3000);
        } catch (err) {
            setPwError(err.response?.data?.message ?? err.response?.data?.error ?? "Failed to change password.");
        } finally { setSavingPw(false); }
    };

    /* Delete account */
    const handleDeleteAccount = async () => {
        try { await deleteAccountApi(); logout(); }
        catch (err) { console.error("Delete failed:", err); }
    };

    const TABS = [
        { id: "profile", label: "Profile", icon: FiUser },
        { id: "security", label: "Security", icon: FiLock },
    ];

    const setInfo = (k) => (e) => setInfoForm((p) => ({ ...p, [k]: e.target.value }));
    const setAddr = (k) => (e) => setAddrForm((p) => ({ ...p, [k]: e.target.value }));

    return (
        <div className="min-h-screen bg-[#0d0800]">
            <style>{keyframes}</style>

            {userLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
                    <LoadingSpinner size={32} color="#ff6b00" />
                </div>
            )}

            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <p className={`${tw.labelOrange} mb-1`}>Account</p>
                    <h1 className="heading text-5xl text-white">MY PROFILE</h1>
                </div>

                <div className="grid gap-6" style={{ gridTemplateColumns: "280px 1fr" }}>

                    {/* ── Sidebar ── */}
                    <div className="flex flex-col gap-4">

                        {/* Avatar */}
                        <div className={`${tw.cardPadded} flex flex-col items-center text-center gap-4`}>
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center heading text-3xl text-white" style={{ background: gradients.brand, boxShadow: shadows.stepActive }}>
                                    {initials}
                                </div>
                                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-[#0d0800] flex items-center justify-center hover:scale-110 transition-all" style={{ background: gradients.brand }}>
                                    <FiCamera size={12} className="text-white" />
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-white">{infoForm.firstName} {infoForm.lastName}</p>
                                <p className="text-xs text-[#664433] mt-0.5">{infoForm.email}</p>
                                {user?.role && (
                                    <span className="inline-block mt-2 text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-[#ff6b0015] text-[#ff6b00] border border-[#ff6b0033]">
                                        {user.role}
                                    </span>
                                )}
                            </div>
                            <button onClick={refreshProfile} disabled={userLoading} className="text-[10px] tracking-widest uppercase text-[#664433] hover:text-[#ff6b00] transition-colors disabled:opacity-40">
                                ↻ Refresh
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-col gap-2.5">
                            <StatCard icon={FiShoppingBag} label="Total Orders" value={orderCount} color="#ff6b00" />
                        </div>

                        {/* Nav */}
                        <div className={`${tw.card} overflow-hidden`}>
                            {TABS.map(({ id, label, icon: Icon }) => {
                                const active = activeTab === id;
                                return (
                                    <button key={id} onClick={() => setActiveTab(id)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
                                        style={{ background: active ? "#1e0a00" : "transparent", color: active ? "#ff6b00" : "#664433", borderLeft: active ? "2px solid #ff6b00" : "2px solid transparent" }}
                                    >
                                        <div className="flex items-center gap-2.5"><Icon size={13} />{label}</div>
                                        {active && <FiChevronRight size={12} />}
                                    </button>
                                );
                            })}
                            <div className="border-t border-[#1e1000]">
                                <button onClick={logout} className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold tracking-widest uppercase text-[#ff0040] hover:bg-[#1a0005] transition-colors" style={{ borderLeft: "2px solid transparent" }}>
                                    <FiLogOut size={13} /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Content ── */}
                    <div className="flex flex-col gap-4">

                        {activeTab === "profile" && (
                            <>
                                {/* Personal Information */}
                                <Section title="PERSONAL INFORMATION">
                                    <EditToolbar editing={editingInfo} saving={savingInfo} onEdit={() => setEditingInfo(true)} onSave={handleSaveInfo} onCancel={handleCancelInfo} />
                                    <ErrorBanner message={infoError} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField icon={FiUser} label="First Name" value={infoForm.firstName} editing={editingInfo} name="firstName" onChange={setInfo("firstName")} placeholder="John" />
                                        <FormField icon={FiUser} label="Last Name" value={infoForm.lastName} editing={editingInfo} name="lastName" onChange={setInfo("lastName")} placeholder="Doe" />
                                    </div>
                                    <FormField icon={FiMail} label="Email" type="email" value={infoForm.email} editing={editingInfo} name="email" onChange={setInfo("email")} placeholder="your@email.com" />
                                    <FormField icon={FiPhone} label="Phone" type="tel" value={infoForm.phone} editing={editingInfo} name="phone" onChange={setInfo("phone")} placeholder="+1 (555) 000-0000" />
                                </Section>

                                {/* Shipping Address */}
                                <Section title="SHIPPING ADDRESS">
                                    <EditToolbar editing={editingAddr} saving={savingAddr} onEdit={() => setEditingAddr(true)} onSave={handleSaveAddr} onCancel={handleCancelAddr} />
                                    <ErrorBanner message={addrError} />
                                    <FormField icon={FiMapPin} label="Street Address" value={addrForm.address} editing={editingAddr} name="address" onChange={setAddr("address")} placeholder="123 Main Street" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField icon={FiMapPin} label="City" value={addrForm.city} editing={editingAddr} name="city" onChange={setAddr("city")} placeholder="New York" />
                                        <div className="flex flex-col gap-1.5">
                                            <label className={tw.label}>Country</label>
                                            <select value={addrForm.country} onChange={setAddr("country")} disabled={!editingAddr} className={`${tw.select} ${!editingAddr ? "opacity-70 cursor-default" : ""}`}>
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

                                {/* Danger Zone */}
                                <div className="bg-[#1a0005] border border-[#ff004033] rounded-2xl p-6">
                                    <h2 className="heading text-lg text-[#ff0040] mb-2">DANGER ZONE</h2>
                                    <p className="text-xs text-[#664433] mb-4 leading-relaxed">Once you delete your account, there is no going back.</p>
                                    {!showDeleteConfirm ? (
                                        <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase text-[#ff0040] border border-[#ff004044] bg-transparent hover:bg-[#ff00400f] transition-colors cursor-pointer">
                                            <FiTrash2 size={13} /> Delete Account
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <p className="text-xs text-[#ff0040] flex-1">Are you sure? This cannot be undone.</p>
                                            <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-2 rounded-lg text-xs text-[#664433] border border-[#2a1500] bg-transparent hover:border-[#ff6b00] hover:text-[#ff6b00] transition-colors cursor-pointer">Cancel</button>
                                            <button onClick={handleDeleteAccount} className="px-3 py-2 rounded-lg text-xs font-bold text-white bg-[#ff0040] border-none cursor-pointer hover:opacity-80 transition-opacity">Confirm Delete</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === "security" && (
                            <Section title="CHANGE PASSWORD">
                                <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                                    <PasswordInput label="Current Password" placeholder="••••••••" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} />

                                    <div className={tw.divider} />

                                    <PasswordInput label="New Password" placeholder="Min. 8 characters" value={passwords.newPwd} onChange={(e) => setPasswords((p) => ({ ...p, newPwd: e.target.value }))} />
                                    <PasswordStrength password={passwords.newPwd} />

                                    <PasswordInput label="Confirm New Password" placeholder="Repeat new password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} />

                                    <ErrorBanner message={pwError} />
                                    <SuccessBanner message={pwSuccess ? "Password updated successfully." : ""} />

                                    <button
                                        type="submit"
                                        disabled={savingPw}
                                        className={`${tw.btnPrimary} w-full py-3.5 flex items-center justify-center gap-2.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed`}
                                        style={{ background: gradients.brand, boxShadow: shadows.btnGlow }}
                                    >
                                        {savingPw ? <><LoadingSpinner size={16} /> Updating…</> : <><FiLock size={13} /> Update Password</>}
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