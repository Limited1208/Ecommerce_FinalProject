import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiShoppingBag, FiTrendingUp, FiArrowRight, FiUsers, FiLayers, FiShoppingCart } from "react-icons/fi";
import { usePageTitle } from "../../hooks/usePageTitle";
import { fetchAdminStats } from "../../api/adminApi";
import { PRODUCTS } from "../../data/constants";
import { gradients, tw } from "../../assets/theme";
import { getAdminUser } from "../../hooks/useAdminAuth";

function StatCard({ icon: Icon, label, value, sub }) {
    return (
        <div className={`${tw.cardPadded} flex flex-col gap-2`} style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}>
            <div className="flex items-center justify-between">
                <span className={tw.label}>{label}</span>
                <Icon className="text-[#ff6b00] opacity-80" size={18} />
            </div>
            <p className="heading text-3xl text-white tracking-wide">{value}</p>
            {sub && <p className="text-[11px] text-[#664433]">{sub}</p>}
        </div>
    );
}

export default function AdminDashboard() {
    usePageTitle("Admin · Dashboard");
    const admin = getAdminUser();

    const [stats, setStats] = useState({
        productCount: PRODUCTS.length,
        ordersToday: null,
        revenueMonth: null,
        loading: true,
        fromApi: false,
    });

    useEffect(() => {
        let cancelled = false;
        fetchAdminStats()
            .then((data) => {
                if (cancelled) return;
                const revenue = data.revenueMonth ?? data.revenue ?? data.monthlyRevenue;
                setStats({
                    productCount: data.productCount ?? data.products ?? PRODUCTS.length,
                    ordersToday: data.ordersToday ?? data.ordersTodayCount ?? data.orders,
                    revenueMonth: typeof revenue === "number" ? revenue : null,
                    loading: false,
                    fromApi: true,
                });
            })
            .catch(() => {
                if (cancelled) return;
                setStats({
                    productCount: PRODUCTS.length,
                    ordersToday: 24,
                    revenueMonth: 12400,
                    loading: false,
                    fromApi: false,
                });
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const fmtMoney = (n) =>
        typeof n === "number"
            ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
            : "—";

    return (
        <div className="max-w-5xl">
            <p className={`${tw.labelOrange} mb-2`}>Overview</p>
            <h2 className="heading text-3xl text-white mb-2">Dashboard</h2>
            <p className="text-sm text-[#664433] mb-8">
                Hello{admin?.name ? `, ${admin.name}` : ""}. Here is a snapshot of your store
                {!stats.fromApi && stats.loading === false && (
                    <span className="text-[#2a1500]"> · showing sample figures until /admin/stats is available</span>
                )}
                .
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-10">
                <StatCard
                    icon={FiPackage}
                    label="Catalog"
                    value={stats.loading ? "…" : String(stats.productCount)}
                    sub="Products in storefront data"
                />
                <StatCard
                    icon={FiShoppingBag}
                    label="Orders today"
                    value={
                        stats.loading
                            ? "…"
                            : stats.ordersToday != null && stats.ordersToday !== ""
                              ? String(stats.ordersToday)
                              : "—"
                    }
                    sub="Last 24 hours"
                />
                <StatCard
                    icon={FiTrendingUp}
                    label="Revenue (month)"
                    value={stats.loading ? "…" : fmtMoney(stats.revenueMonth)}
                    sub="Gross before refunds"
                />
            </div>

            <p className={`${tw.label} mb-3`}>Management</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
                {[
                    { to: "/admin/products", label: "Products", sub: "Catalog & pricing", Icon: FiPackage },
                    { to: "/admin/users", label: "Users", sub: "Accounts", Icon: FiUsers },
                    { to: "/admin/categories", label: "Categories", sub: "Taxonomy", Icon: FiLayers },
                    { to: "/admin/orders", label: "Orders", sub: "Fulfillment", Icon: FiShoppingCart },
                ].map(({ to, label, sub, Icon }) => (
                    <Link
                        key={to}
                        to={to}
                        className={`${tw.card} p-4 no-underline flex items-start gap-3 border border-[#2a1500] hover:border-[#ff6b0044] transition-colors group`}
                    >
                        <Icon className="text-[#ff6b00] shrink-0 mt-0.5 group-hover:scale-105 transition-transform" size={20} />
                        <div>
                            <p className="heading text-lg text-white mb-0.5">{label}</p>
                            <p className="text-[11px] text-[#664433]">{sub}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div
                className="rounded-2xl border border-[#2a1500] p-8 relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #130900 0%, #0d0800 100%)",
                }}
            >
                <div
                    className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-[0.07] blur-3xl pointer-events-none"
                    style={{ background: gradients.brand }}
                />
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h3 className="heading text-xl text-white mb-2">Storefront</h3>
                        <p className="text-sm text-[#aa8866] max-w-md leading-relaxed">
                            Preview the live shop, test checkout flows, and verify catalog content alongside this console.
                        </p>
                    </div>
                    <Link
                        to="/"
                        className={`${tw.btnPrimary} inline-flex items-center gap-2 px-6 py-3 no-underline shrink-0`}
                        style={{ background: gradients.brand, boxShadow: "0 8px 24px rgba(255,107,0,0.25)" }}
                    >
                        Open store <FiArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
