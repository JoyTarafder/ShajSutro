"use client";

import { useEffect, useState, useCallback } from "react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { useAdminAuth } from "@/context/AdminAuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: { name: string; email: string } | null;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: { city: string; country: string };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_STYLE: Record<OrderStatus, { badge: string; dot: string }> = {
  pending:   { badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",       dot: "bg-amber-400" },
  confirmed: { badge: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",    dot: "bg-violet-500" },
  shipped:   { badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",          dot: "bg-blue-500" },
  delivered: { badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  cancelled: { badge: "bg-red-50 text-red-600 ring-1 ring-red-200",             dot: "bg-red-500" },
};

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium ${type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
      {type === "success" ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
      )}
      {msg}
    </div>
  );
}

// ─── Status Dropdown ──────────────────────────────────────────────────────────

function StatusSelect({
  orderId, current, onUpdate,
}: {
  orderId: string;
  current: OrderStatus;
  onUpdate: (id: string, status: OrderStatus) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const style = STATUS_STYLE[current];

  const choose = async (s: OrderStatus) => {
    setOpen(false);
    if (s === current) return;
    setUpdating(true);
    try { await onUpdate(orderId, s); } finally { setUpdating(false); }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={updating}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${style.badge} ${updating ? "opacity-60" : "hover:opacity-80"}`}
      >
        {updating ? (
          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
        )}
        {current}
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1.5 left-0 z-20 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 overflow-hidden">
            {STATUSES.map((s) => {
              const st = STATUS_STYLE[s];
              return (
                <button
                  key={s}
                  onClick={() => choose(s)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium capitalize hover:bg-gray-50 transition-colors ${s === current ? "text-gray-900 font-semibold" : "text-gray-600"}`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${st.dot}`} />
                  {s}
                  {s === current && (
                    <svg className="w-3 h-3 ml-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function OrdersContent() {
  const { apiFetch } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await apiFetch<{
        success: boolean;
        data: Order[];
        pagination: { total: number; pages: number };
      }>(`/admin/orders?${params}`);
      setOrders(res.data);
      setPagination({ total: res.pagination.total, pages: res.pagination.pages });
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [apiFetch, page, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    try {
      await apiFetch(`/admin/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      showToast("success", `Status updated to "${status}"`);
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Update failed");
      throw e;
    }
  };

  // Count per status for filter tabs
  const tabCounts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="p-8 space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div>
        <p className="text-sm text-slate-400 font-medium">{pagination.total} total order{pagination.total !== 1 ? "s" : ""}</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setStatusFilter("all"); setPage(1); }}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${statusFilter === "all" ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"}`}
        >
          All
          <span className={`ml-2 text-xs ${statusFilter === "all" ? "text-slate-400" : "text-slate-400"}`}>{pagination.total}</span>
        </button>
        {STATUSES.map((s) => {
          const st = STATUS_STYLE[s];
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                active ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-white/60" : st.dot}`} />
              {s}
            </button>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-[2.5px] border-slate-200 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
            <p className="text-sm font-medium">No orders {statusFilter !== "all" ? `with status "${statusFilter}"` : "yet"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Order", "Customer", "Items", "Destination", "Total", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.08em] px-6 py-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-violet-50/20 transition-colors duration-100">
                    <td className="px-6 py-4">
                      <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.user ? (
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{order.user.name}</p>
                          <p className="text-xs text-slate-400">{order.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Deleted user</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[160px] space-y-0.5">
                        {order.items.slice(0, 2).map((item, i) => (
                          <p key={i} className="text-xs text-slate-600 truncate">
                            <span className="font-bold">{item.quantity}×</span> {item.name}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-slate-400">+{order.items.length - 2} more</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {order.shippingAddress?.city && (
                        <span>{order.shippingAddress.city}, {order.shippingAddress.country}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-slate-900">${order.total.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusSelect
                        orderId={order._id}
                        current={order.status}
                        onUpdate={handleStatusUpdate}
                      />
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-medium whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/40">
            <p className="text-sm text-slate-500">Page <span className="font-bold text-slate-700">{page}</span> of {pagination.pages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-xl hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
              <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-xl hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Tip for tabCounts usage */}
      {statusFilter === "all" && Object.values(tabCounts).some(Boolean) && (
        <p className="text-xs text-slate-400 text-center">
          Showing all orders — use the filters above to narrow by status
        </p>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return <AdminAuthGuard><OrdersContent /></AdminAuthGuard>;
}
