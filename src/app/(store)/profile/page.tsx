"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { getApiBase } from "@/lib/apiBase";

const API = getApiBase();

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "bkash" | "nagad" | "rocket" | "cod";
  txnId?: string;
  paymentStatus: "pending_verification" | "pending_delivery" | "paid";
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig: Record<Order["status"], { label: string; classes: string }> = {
  pending:   { label: "Pending",   classes: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  confirmed: { label: "Confirmed", classes: "bg-blue-50 text-blue-700 border-blue-200" },
  shipped:   { label: "Shipped",   classes: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  delivered: { label: "Delivered", classes: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", classes: "bg-red-50 text-red-600 border-red-200" },
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = "overview" | "orders" | "account" | "security";

export default function ProfilePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchUser = useCallback(async () => {
    if (!token) { router.replace("/login"); return; }
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { router.replace("/login"); return; }
      const data = await res.json();
      setUser(data.data);
    } catch {
      router.replace("/login");
    } finally {
      setLoadingUser(false);
    }
  }, [token, router]);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setOrders(data.data ?? []);
    } catch { /* silent */ }
  }, [token]);

  useEffect(() => { fetchUser(); }, [fetchUser]);
  useEffect(() => { if (tab === "orders") fetchOrders(); }, [tab, fetchOrders]);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-charcoal-300 animate-bounce" style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">

        {/* ── Top header ── */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-400 mb-1">My Account</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-charcoal-950 tracking-tight">
            Hello, {user.name.split(" ")[0]}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-7">

          {/* ── Sidebar ── */}
          <aside className="lg:w-64 shrink-0 space-y-3">
            {/* Avatar card */}
            <div className="bg-white rounded-2xl border border-charcoal-100 p-6 flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-charcoal-950 flex items-center justify-center text-white text-xl font-semibold tracking-wide select-none">
                {initials(user.name)}
              </div>
              <div>
                <p className="font-semibold text-charcoal-950 text-sm">{user.name}</p>
                <p className="text-xs text-charcoal-400 mt-0.5 font-light">{user.email}</p>
              </div>
              <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-charcoal-50 border border-charcoal-100 text-charcoal-500 uppercase tracking-wide">
                {user.role}
              </span>
            </div>

            {/* Nav */}
            <nav className="bg-white rounded-2xl border border-charcoal-100 overflow-hidden">
              {(
                [
                  { id: "overview", icon: GridIcon,    label: "Overview" },
                  { id: "orders",   icon: BoxIcon,      label: "My Orders" },
                  { id: "account",  icon: UserIcon,     label: "Account Settings" },
                  { id: "security", icon: LockIcon,     label: "Security" },
                ] as { id: Tab; icon: React.FC<{ className?: string }>; label: string }[]
              ).map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-all duration-200 border-b border-charcoal-50 last:border-0 ${
                    tab === id
                      ? "bg-charcoal-950 text-white"
                      : "text-charcoal-600 hover:bg-charcoal-50 hover:text-charcoal-950"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              ))}
            </nav>

            {/* Logout */}
            <button
              onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}
              className="w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-red-500 hover:text-red-600 bg-white hover:bg-red-50 rounded-2xl border border-charcoal-100 transition-all duration-200"
            >
              <LogoutIcon className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
          </aside>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0">
            {tab === "overview" && <OverviewTab user={user} orders={orders} onFetchOrders={fetchOrders} onTabChange={setTab} />}
            {tab === "orders"   && <OrdersTab orders={orders} onFetch={fetchOrders} />}
            {tab === "account"  && <AccountTab user={user} token={token!} onUpdated={fetchUser} />}
            {tab === "security" && <SecurityTab token={token!} />}
          </main>
        </div>
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({
  user,
  orders,
  onFetchOrders,
  onTabChange,
}: {
  user: UserData;
  orders: Order[];
  onFetchOrders: () => void;
  onTabChange: (t: Tab) => void;
}) {
  useEffect(() => { onFetchOrders(); }, [onFetchOrders]);

  const delivered  = orders.filter((o) => o.status === "delivered").length;
  const active     = orders.filter((o) => ["pending","confirmed","shipped"].includes(o.status)).length;
  const totalSpent = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "Total Orders",    value: orders.length,             icon: BoxIcon },
    { label: "Active Orders",   value: active,                    icon: TruckIcon },
    { label: "Delivered",       value: delivered,                 icon: CheckCircleIcon },
    { label: "Total Spent",     value: `৳${totalSpent.toLocaleString()}`, icon: WalletIcon },
  ];

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-charcoal-100 p-5">
            <div className="w-9 h-9 rounded-xl bg-charcoal-50 flex items-center justify-center mb-3">
              <Icon className="w-4 h-4 text-charcoal-600" />
            </div>
            <p className="text-xl font-bold text-charcoal-950">{value}</p>
            <p className="text-xs text-charcoal-400 mt-0.5 font-light">{label}</p>
          </div>
        ))}
      </div>

      {/* Member since */}
      <div className="bg-charcoal-950 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal-400 mb-1">Member Since</p>
          <p className="text-white font-semibold">{formatDate(user.createdAt!)}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
          <StarIcon className="w-5 h-5 text-white/70" />
        </div>
      </div>

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white rounded-2xl border border-charcoal-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-50">
            <h2 className="text-sm font-semibold text-charcoal-950">Recent Orders</h2>
            <button onClick={() => onTabChange("orders")} className="text-xs text-charcoal-400 hover:text-charcoal-700 transition-colors font-medium">
              View all
            </button>
          </div>
          <div className="divide-y divide-charcoal-50">
            {recentOrders.map((order) => (
              <OrderRow key={order._id} order={order} />
            ))}
          </div>
        </div>
      )}

      {recentOrders.length === 0 && (
        <EmptyState
          icon={BoxIcon}
          title="No orders yet"
          description="Start shopping and your orders will appear here."
          actionLabel="Shop Now"
          actionHref="/shop"
        />
      )}
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab({ orders, onFetch }: { orders: Order[]; onFetch: () => void }) {
  useEffect(() => { onFetch(); }, [onFetch]);

  const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={BoxIcon}
        title="No orders yet"
        description="When you place orders, they'll show up here."
        actionLabel="Start Shopping"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-charcoal-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-charcoal-50">
        <h2 className="text-sm font-semibold text-charcoal-950">Order History</h2>
        <p className="text-xs text-charcoal-400 mt-0.5">{sorted.length} order{sorted.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="divide-y divide-charcoal-50">
        {sorted.map((order) => (
          <OrderRow key={order._id} order={order} expanded />
        ))}
      </div>
    </div>
  );
}

const paymentStatusConfig = {
  pending_verification: { label: "Verifying Payment", classes: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  pending_delivery:     { label: "Awaiting Delivery",  classes: "bg-blue-50 text-blue-700 border-blue-200",   dot: "bg-blue-400" },
  paid:                 { label: "Payment Confirmed",  classes: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
};

const methodLabel = (m: Order["paymentMethod"]) =>
  m === "bkash" ? "bKash" : m === "nagad" ? "Nagad" : m === "rocket" ? "Rocket" : "Cash on Delivery";

function OrderRow({ order, expanded = false }: { order: Order; expanded?: boolean }) {
  const [open, setOpen] = useState(false);
  const cfg    = statusConfig[order.status];
  const payCfg = paymentStatusConfig[order.paymentStatus];

  return (
    <div className="px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs font-mono text-charcoal-400">#{order._id.slice(-8).toUpperCase()}</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.classes}`}>
              {cfg.label}
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${payCfg.classes}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${payCfg.dot}`} />
              {payCfg.label}
            </span>
          </div>
          <p className="text-sm font-medium text-charcoal-700 mt-1.5">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""} &middot; {methodLabel(order.paymentMethod)}
            {order.txnId && <span className="text-charcoal-400 font-mono text-xs ml-1">(TxnID: {order.txnId})</span>}
          </p>
          <p className="text-xs text-charcoal-400 mt-0.5 font-light">{formatDate(order.createdAt)}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-charcoal-950">৳{order.total.toLocaleString()}</p>
          {expanded && (
            <button
              onClick={() => setOpen(!open)}
              className="text-xs text-charcoal-400 hover:text-charcoal-700 transition-colors mt-1 font-medium"
            >
              {open ? "Hide items" : "View items"}
            </button>
          )}
        </div>
      </div>

      {expanded && open && (
        <div className="mt-4 border-t border-charcoal-50 pt-4 space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} className="w-12 h-14 rounded-lg object-cover bg-charcoal-50 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal-800 truncate">{item.name}</p>
                <p className="text-xs text-charcoal-400 mt-0.5">{item.size} · {item.color} · Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-charcoal-950 shrink-0">৳{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-charcoal-50 space-y-1 text-xs text-charcoal-500">
            {order.discount > 0 && <div className="flex justify-between"><span>Discount</span><span className="text-green-600 font-medium">−৳{order.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between font-semibold text-charcoal-950"><span>Total</span><span>৳{order.total.toFixed(2)}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Account Settings Tab ─────────────────────────────────────────────────────

function AccountTab({
  user,
  token,
  onUpdated,
}: {
  user: UserData;
  token: string;
  onUpdated: () => void;
}) {
  const [name, setName]   = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Update failed");
      setMsg({ type: "success", text: "Profile updated successfully." });
      onUpdated();
    } catch (err: unknown) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-charcoal-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-charcoal-50">
        <h2 className="text-sm font-semibold text-charcoal-950">Account Settings</h2>
        <p className="text-xs text-charcoal-400 mt-0.5">Update your personal information</p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {msg && (
          <div className={`px-4 py-3 rounded-xl text-sm border ${
            msg.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-600"
          }`}>
            {msg.text}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-charcoal-600 mb-2">Full Name</label>
          <input
            type="text"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal-600 mb-2">Email Address</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal-600 mb-2">Account Type</label>
          <input
            type="text"
            className="input-field bg-charcoal-50 text-charcoal-400 cursor-not-allowed"
            value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            readOnly
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <SmallSpinner /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────

function SecurityTab({ token }: { token: string }) {
  const [current, setCurrent]   = useState("");
  const [newPass, setNewPass]   = useState("");
  const [confirm, setConfirm]   = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (newPass !== confirm) { setMsg({ type: "error", text: "Passwords do not match." }); return; }
    if (newPass.length < 6)  { setMsg({ type: "error", text: "Password must be at least 6 characters." }); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to change password");
      setMsg({ type: "success", text: "Password changed successfully." });
      setCurrent(""); setNewPass(""); setConfirm("");
    } catch (err: unknown) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-charcoal-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-charcoal-50">
        <h2 className="text-sm font-semibold text-charcoal-950">Security</h2>
        <p className="text-xs text-charcoal-400 mt-0.5">Keep your account safe</p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {msg && (
          <div className={`px-4 py-3 rounded-xl text-sm border ${
            msg.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-600"
          }`}>
            {msg.text}
          </div>
        )}

        {[
          { label: "Current Password", value: current, onChange: setCurrent, placeholder: "Enter current password" },
          { label: "New Password",     value: newPass, onChange: setNewPass, placeholder: "Min. 6 characters" },
          { label: "Confirm Password", value: confirm, onChange: setConfirm, placeholder: "Repeat new password" },
        ].map(({ label, value, onChange, placeholder }) => (
          <div key={label}>
            <label className="block text-xs font-medium text-charcoal-600 mb-2">{label}</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                className="input-field pr-11"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-600 transition-colors"
              >
                <EyeIconSmall open={show} />
              </button>
            </div>
          </div>
        ))}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <SmallSpinner /> : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-charcoal-100 p-14 flex flex-col items-center text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-charcoal-50 flex items-center justify-center">
        <Icon className="w-6 h-6 text-charcoal-400" />
      </div>
      <div>
        <p className="font-semibold text-charcoal-900">{title}</p>
        <p className="text-sm text-charcoal-400 mt-1 font-light">{description}</p>
      </div>
      <a href={actionHref} className="btn-primary mt-1 px-7 py-3">
        {actionLabel}
      </a>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function EyeIconSmall({ open }: { open: boolean }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      )}
    </svg>
  );
}

function SmallSpinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
