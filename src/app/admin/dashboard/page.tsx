"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import StatCard from "@/components/admin/StatCard";
import DataTable from "@/components/admin/DataTable";
import { useAdminAuth } from "@/context/AdminAuthContext";

const RevenueChart = dynamic(
  () => import("@/components/admin/RevenueChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-violet-500 rounded-full animate-spin" />
      </div>
    ),
  }
);

const OrderStatusChart = dynamic(
  () => import("@/components/admin/OrderStatusChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-violet-500 rounded-full animate-spin" />
      </div>
    ),
  }
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: { _id: string; count: number }[];
  recentOrders: RecentOrder[];
  revenueByDay: { date: string; revenue: number }[];
}

interface RecentOrder {
  _id: string;
  user: { name: string; email: string } | null;
  total: number;
  status: string;
  createdAt: string;
  items: unknown[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { bg: string; text: string; dot: string }> = {
  pending:   { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400" },
  confirmed: { bg: "bg-violet-50",  text: "text-violet-700",  dot: "bg-violet-500" },
  shipped:   { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
  delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  cancelled: { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500" },
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function DashboardContent() {
  const { apiFetch } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ data: DashboardStats }>("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [apiFetch]);

  const orderColumns = [
    {
      key: "_id",
      label: "Order",
      render: (row: RecentOrder) => (
        <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg">
          #{row._id.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      key: "user",
      label: "Customer",
      render: (row: RecentOrder) =>
        row.user ? (
          <div>
            <p className="text-sm font-semibold text-slate-900">{row.user.name}</p>
            <p className="text-xs text-slate-400">{row.user.email}</p>
          </div>
        ) : (
          <span className="text-slate-400 text-xs italic">Deleted user</span>
        ),
    },
    {
      key: "items",
      label: "Items",
      render: (row: RecentOrder) => (
        <span className="text-sm text-slate-600 font-medium">
          {row.items.length} item{row.items.length !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (row: RecentOrder) => (
        <span className="font-black text-slate-900">${fmt(row.total)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: RecentOrder) => {
        const s = STATUS_BADGE[row.status];
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
              s ? `${s.bg} ${s.text}` : "bg-slate-100 text-slate-600"
            }`}
          >
            {s && <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />}
            {row.status}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row: RecentOrder) => (
        <span className="text-xs text-slate-400 font-medium">
          {new Date(row.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-[2.5px] border-slate-200 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-slate-700 font-semibold text-sm">{error}</p>
          <button
            onClick={() => location.reload()}
            className="mt-3 text-sm text-violet-600 hover:text-violet-700 font-semibold hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-7">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${fmt(stats?.totalRevenue ?? 0)}`}
          accent="emerald"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Total Orders"
          value={fmt(stats?.totalOrders ?? 0)}
          accent="violet"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          }
        />
        <StatCard
          title="Total Products"
          value={fmt(stats?.totalProducts ?? 0)}
          accent="amber"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          }
        />
        <StatCard
          title="Total Users"
          value={fmt(stats?.totalUsers ?? 0)}
          accent="blue"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Revenue Over Time</h2>
              <p className="text-xs text-slate-400 mt-0.5">Daily revenue trend</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </div>
          </div>
          <RevenueChart data={stats?.revenueByDay ?? []} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Orders by Status</h2>
              <p className="text-xs text-slate-400 mt-0.5">Current distribution</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
              </svg>
            </div>
          </div>
          <OrderStatusChart data={stats?.ordersByStatus ?? []} />
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Orders</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest customer activity</p>
          </div>
        </div>
        <DataTable<RecentOrder>
          columns={orderColumns}
          data={stats?.recentOrders ?? []}
          emptyMessage="No recent orders."
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AdminAuthGuard>
      <DashboardContent />
    </AdminAuthGuard>
  );
}
