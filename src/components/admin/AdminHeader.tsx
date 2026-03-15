"use client";

import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";

const PAGE_META: Record<string, { title: string; desc: string }> = {
  "/admin/dashboard": {
    title: "Dashboard",
    desc: "Welcome back — here's your store at a glance.",
  },
  "/admin/users": {
    title: "Users",
    desc: "Manage and monitor customer accounts.",
  },
  "/admin/products": {
    title: "Products",
    desc: "Manage your store catalog and inventory.",
  },
  "/admin/orders": {
    title: "Orders",
    desc: "Track and fulfill customer orders.",
  },
};

export default function AdminHeader() {
  const pathname = usePathname();
  const { admin } = useAdminAuth();

  const meta = PAGE_META[pathname] ?? { title: "Admin", desc: "" };

  return (
    <header className="h-[60px] bg-white border-b border-slate-100/80 flex items-center justify-between px-8 flex-shrink-0">
      {/* Page title */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 leading-none">{meta.title}</h1>
          {meta.desc && (
            <p className="text-[11px] text-slate-400 mt-0.5 hidden lg:block">{meta.desc}</p>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/70 rounded-xl text-sm text-slate-400 w-48 cursor-pointer hover:border-slate-300 transition-colors">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <span className="text-[12px]">Quick search…</span>
          <kbd className="ml-auto text-[10px] font-medium bg-slate-200/70 text-slate-400 px-1.5 py-0.5 rounded">⌘K</kbd>
        </div>

        {/* Notification bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* User */}
        {admin && (
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-[12px] font-semibold text-slate-800 leading-none">{admin.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Administrator</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm shadow-violet-300">
              {admin.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
