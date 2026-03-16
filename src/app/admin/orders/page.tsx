"use client";

import { useEffect, useState, useCallback } from "react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { useAdminAuth } from "@/context/AdminAuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "pending_verification" | "pending_delivery" | "paid";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
}

interface ShippingAddress {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  email?: string;
  phone?: string;
}

interface Order {
  _id: string;
  user: { name: string; email: string } | null;
  items: OrderItem[];
  total: number;
  subtotal?: number;
  shippingCost?: number;
  tax?: number;
  discount?: number;
  status: OrderStatus;
  paymentMethod?: "bkash" | "nagad" | "rocket" | "cod";
  txnId?: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  shippingAddress: ShippingAddress;
}

const PAYMENT_STATUS_STYLE: Record<PaymentStatus, { badge: string; dot: string; label: string }> = {
  pending_verification: { badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-400", label: "Verifying Payment" },
  pending_delivery:     { badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",   dot: "bg-blue-400",  label: "Awaiting Delivery" },
  paid:                 { badge: "bg-green-50 text-green-700 ring-1 ring-green-200", dot: "bg-green-500", label: "Paid" },
};

const METHOD_LABEL: Record<string, string> = {
  bkash: "bKash", nagad: "Nagad", rocket: "Rocket", cod: "Cash on Delivery",
};

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

// ─── Order Details Modal ──────────────────────────────────────────────────────

function OrderDetailsModal({ order, onClose, onStatusUpdate, onConfirmPayment }: {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (id: string, status: OrderStatus) => Promise<void>;
  onConfirmPayment: (id: string) => Promise<void>;
}) {
  const addr = order.shippingAddress;
  const fullName = [addr.firstName, addr.lastName].filter(Boolean).join(" ");
  const [confirmingPay, setConfirmingPay] = useState(false);
  const payCfg = PAYMENT_STATUS_STYLE[order.paymentStatus ?? "pending_verification"];

  const handleConfirmPayment = async () => {
    setConfirmingPay(true);
    try { await onConfirmPayment(order._id); } finally { setConfirmingPay(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">#{order._id.slice(-12).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-5 space-y-5">
          {/* Status + Date */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Placed on</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(order.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <StatusSelect orderId={order._id} current={order.status} onUpdate={onStatusUpdate} />
          </div>

          {/* Payment Confirmation Banner */}
          {order.paymentStatus !== "paid" && (
            <div className={`rounded-2xl p-4 border flex items-center justify-between gap-4 ${
              order.paymentStatus === "pending_verification"
                ? "bg-amber-50 border-amber-200"
                : "bg-blue-50 border-blue-200"
            }`}>
              <div>
                <p className={`text-sm font-semibold ${order.paymentStatus === "pending_verification" ? "text-amber-800" : "text-blue-800"}`}>
                  {order.paymentStatus === "pending_verification" ? "⏳ Payment Verification Required" : "🚚 Cash on Delivery — Confirm on Delivery"}
                </p>
                <p className={`text-xs mt-0.5 font-light ${order.paymentStatus === "pending_verification" ? "text-amber-700" : "text-blue-700"}`}>
                  {order.paymentMethod && order.paymentMethod !== "cod" && order.txnId
                    ? <>{METHOD_LABEL[order.paymentMethod]} TxnID: <strong className="font-mono">{order.txnId}</strong></>
                    : "Click Confirm Payment once you've verified the amount received."}
                </p>
              </div>
              <button
                onClick={handleConfirmPayment}
                disabled={confirmingPay}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                {confirmingPay ? (
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                )}
                Confirm Payment
              </button>
            </div>
          )}

          {order.paymentStatus === "paid" && (
            <div className="rounded-2xl p-4 border bg-green-50 border-green-200 flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p className="text-sm font-semibold text-green-800">Payment Confirmed</p>
            </div>
          )}

          {/* Customer + Shipping */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Customer</p>
              {order.user ? (
                <>
                  <p className="text-sm font-semibold text-slate-900">{order.user.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{order.user.email}</p>
                </>
              ) : (
                <p className="text-xs text-slate-400 italic">Deleted user</p>
              )}
              {addr.email && <p className="text-xs text-slate-500 mt-0.5">{addr.email}</p>}
              {addr.phone && <p className="text-xs text-slate-500 mt-0.5">{addr.phone}</p>}
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Ship To</p>
              {fullName && <p className="text-sm font-semibold text-slate-900">{fullName}</p>}
              {addr.address && <p className="text-xs text-slate-500 mt-0.5">{addr.address}</p>}
              <p className="text-xs text-slate-500">
                {[addr.city, addr.state, addr.zip].filter(Boolean).join(", ")}
              </p>
              {addr.country && <p className="text-xs text-slate-500">{addr.country}</p>}
            </div>
          </div>

          {/* Payment method + TxnID */}
          {order.paymentMethod && (
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${payCfg.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${payCfg.dot}`}/>
                {payCfg.label}
              </span>
              <span className="font-medium">{METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}</span>
              {order.txnId && <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">TxnID: {order.txnId}</span>}
            </div>
          )}

          {/* Items */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Items ({order.items.length})</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400">
                      {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-900">৳{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-slate-400">{item.quantity} × ৳{item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-slate-100 pt-4 space-y-1.5">
            {order.subtotal !== undefined && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium">৳{order.subtotal.toFixed(2)}</span>
              </div>
            )}
            {order.shippingCost !== undefined && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <span className="font-medium">{order.shippingCost === 0 ? "Free" : `৳${order.shippingCost.toFixed(2)}`}</span>
              </div>
            )}
            {order.tax !== undefined && order.tax > 0 && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tax</span>
                <span className="font-medium">৳{order.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-100 pt-2 mt-2">
              <span>Total</span>
              <span>৳{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function OrdersContent() {
  const { apiFetch } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
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
  }, [apiFetch, page, statusFilter, dateFrom, dateTo]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    try {
      await apiFetch(`/admin/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      showToast("success", `Status updated to "${status}"`);
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
      if (selectedOrder?._id === id) {
        setSelectedOrder((o) => o ? { ...o, status } : o);
      }
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Update failed");
      throw e;
    }
  };

  const handleConfirmPayment = async (id: string) => {
    try {
      await apiFetch(`/admin/orders/${id}/confirm-payment`, { method: "PUT" });
      showToast("success", "Payment confirmed successfully");
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, paymentStatus: "paid", status: o.status === "pending" ? "confirmed" : o.status } : o)));
      if (selectedOrder?._id === id) {
        setSelectedOrder((o) => o ? { ...o, paymentStatus: "paid", status: o.status === "pending" ? "confirmed" : o.status } : o);
      }
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Failed to confirm payment");
      throw e;
    }
  };

  const clearDateFilter = () => {
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return (
    <div className="p-8 space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div>
        <p className="text-sm text-slate-400 font-medium">{pagination.total} total order{pagination.total !== 1 ? "s" : ""}</p>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setStatusFilter("all"); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${statusFilter === "all" ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"}`}
          >
            All
            <span className="ml-2 text-xs opacity-60">{pagination.total}</span>
          </button>
          {STATUSES.map((s) => {
            const st = STATUS_STYLE[s];
            const active = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${active ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-white/60" : st.dot}`} />
                {s}
              </button>
            );
          })}
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-2 lg:ml-auto flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium whitespace-nowrap">From:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium whitespace-nowrap">To:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 bg-white"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={clearDateFilter}
              className="px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
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
                  {["Order", "Customer", "Items", "Destination", "Total", "Payment", "Status", "Date", ""].map((h) => (
                    <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.08em] px-6 py-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-violet-50/20 transition-colors duration-100 group cursor-pointer" onClick={() => setSelectedOrder(order)}>
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
                      <span className="text-sm font-black text-slate-900">৳{order.total.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const ps = PAYMENT_STATUS_STYLE[order.paymentStatus ?? "pending_verification"];
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${ps.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ps.dot}`}/>
                            {ps.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <StatusSelect
                        orderId={order._id}
                        current={order.status}
                        onUpdate={handleStatusUpdate}
                      />
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-medium whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                      >
                        Details
                      </button>
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

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </div>
  );
}

export default function OrdersPage() {
  return <AdminAuthGuard><OrdersContent /></AdminAuthGuard>;
}
