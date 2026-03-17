"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { useAdminAuth } from "@/context/AdminAuthContext";

type Application = {
  _id: string;
  job: {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    level: string;
    isActive: boolean;
  };
  name: string;
  email: string;
  phone: string;
  cvUrl: string;
  note?: string;
  createdAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ApplicationsContent() {
  const { apiFetch } = useAdminAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; data: Application[] }>(
        "/job-applications/all",
      );
      setApps(res.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter((a) => {
      const hay = `${a.name} ${a.email} ${a.phone} ${a.job?.title ?? ""} ${a.job?.department ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [apps, query]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Job Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {apps.length} total submissions
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full sm:w-72">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, job…"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M21 21l-4.35-4.35m1.6-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={fetchAll}
            className="px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-9 h-9 border-[3px] border-slate-200 border-t-violet-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-12 text-center text-slate-500">
          No applications found.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
          <div className="overflow-auto">
            <table className="min-w-[980px] w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-left text-xs font-bold text-slate-600">
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Job</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">CV</th>
                  <th className="px-6 py-4">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{a.name}</p>
                      {a.note?.trim() && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-sm">
                          {a.note}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {a.job?.title ?? "—"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {a.job?.department ?? ""}{a.job ? " · " : ""}{a.job?.location ?? ""}{a.job ? " · " : ""}{a.job?.type ?? ""} · {a.job?.level ?? ""}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-600">
                        <span className="font-semibold">Email:</span> {a.email}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        <span className="font-semibold">Phone:</span> {a.phone}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={a.cvUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 text-xs font-bold hover:bg-violet-100 transition-colors"
                        rel="noreferrer"
                      >
                        Download
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16.5V3m0 13.5l-3.75-3.75M12 16.5l3.75-3.75M3.75 20.25h16.5" />
                        </svg>
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-600">{formatDate(a.createdAt)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <AdminAuthGuard>
      <ApplicationsContent />
    </AdminAuthGuard>
  );
}

