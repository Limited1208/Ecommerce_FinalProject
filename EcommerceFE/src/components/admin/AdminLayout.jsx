import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiLogOut, FiExternalLink, FiPackage, FiUsers, FiLayers, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { keyframes, gradients, tw } from "../../assets/theme";
import { useAdminAuth, getAdminUser } from "../../hooks/useAdminAuth";

export default function AdminLayout() {
    const { logout } = useAdminAuth();
    const user = getAdminUser();

    return (
        <div className="min-h-screen bg-[#0d0800] flex">
            <style>{keyframes}</style>

            <aside className="w-56 shrink-0 border-r border-[#2a1500] flex flex-col py-8 px-4">
                <Link to="/admin" className="flex items-center gap-2 mb-10 px-2 no-underline">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="url(#fireGradAdmin)">
                        <defs>
                            <linearGradient id="fireGradAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ff6b00" />
                                <stop offset="100%" stopColor="#ff0040" />
                            </linearGradient>
                        </defs>
                        <path d="M13 2L4.09 12.97H11L10 22l9.91-10.97H14L13 2z" />
                    </svg>
                    <div>
                        <span className="heading text-sm text-white tracking-[0.15em] block">STRIKEZON</span>
                        <span className={`${tw.labelOrange} !text-[9px]`}>Admin</span>
                    </div>
                </Link>

                <nav className="flex flex-col gap-1">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase no-underline transition-colors ${
                                isActive
                                    ? "text-white bg-[#1e0a00] border border-[#ff6b0044]"
                                    : "text-[#664433] border border-transparent hover:text-[#ff6b00]"
                            }`
                        }
                    >
                        <FiGrid size={15} /> Dashboard
                    </NavLink>
                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase no-underline transition-colors ${
                                isActive
                                    ? "text-white bg-[#1e0a00] border border-[#ff6b0044]"
                                    : "text-[#664433] border border-transparent hover:text-[#ff6b00]"
                            }`
                        }
                    >
                        <FiPackage size={15} /> Products
                    </NavLink>
                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase no-underline transition-colors ${
                                isActive
                                    ? "text-white bg-[#1e0a00] border border-[#ff6b0044]"
                                    : "text-[#664433] border border-transparent hover:text-[#ff6b00]"
                            }`
                        }
                    >
                        <FiUsers size={15} /> Users
                    </NavLink>
                    <NavLink
                        to="/admin/categories"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase no-underline transition-colors ${
                                isActive
                                    ? "text-white bg-[#1e0a00] border border-[#ff6b0044]"
                                    : "text-[#664433] border border-transparent hover:text-[#ff6b00]"
                            }`
                        }
                    >
                        <FiLayers size={15} /> Categories
                    </NavLink>
                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase no-underline transition-colors ${
                                isActive
                                    ? "text-white bg-[#1e0a00] border border-[#ff6b0044]"
                                    : "text-[#664433] border border-transparent hover:text-[#ff6b00]"
                            }`
                        }
                    >
                        <FiShoppingCart size={15} /> Orders
                    </NavLink>
                </nav>

                <div className="mt-auto pt-8 border-t border-[#1e1000] space-y-3">
                    <p className="text-[10px] text-[#2a1500] uppercase tracking-widest px-2">Signed in</p>
                    <p className="text-xs text-[#aa8866] truncate px-2">{user?.email ?? user?.name ?? "Admin"}</p>
                    <a
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 text-[11px] text-[#664433] hover:text-[#ff6b00] no-underline transition-colors"
                    >
                        <FiExternalLink size={14} /> View storefront
                    </a>
                    <button
                        type="button"
                        onClick={logout}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase text-[#ff0040] border border-[#ff004044] bg-transparent hover:bg-[#ff00400f] transition-colors cursor-pointer`}
                    >
                        <FiLogOut size={14} /> Log out
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header
                    className="h-14 shrink-0 border-b border-[#2a1500] flex items-center justify-between px-8"
                    style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}
                >
                    <h1 className="heading text-lg text-white tracking-wide">Console</h1>
                    <div className="h-2 w-24 rounded-full opacity-90" style={{ background: gradients.brand }} />
                </header>
                <main className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
