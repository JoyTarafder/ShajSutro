"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { useAdminAuth } from "@/context/AdminAuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: { _id: string; name: string } | string;
  images: string[];
  sizes: string[];
  colors: string[];
  badge?: string;
  inStock: boolean;
  isFeatured: boolean;
  isVisible: boolean;
  stock: number;
  totalOrdered: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

type ProductForm = {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  images: string;
  sizes: string;
  colors: string;
  badge: string;
  inStock: boolean;
  isFeatured: boolean;
  isVisible: boolean;
  stock: string;
};

const EMPTY_FORM: ProductForm = {
  name: "", description: "", price: "", originalPrice: "",
  category: "", images: "", sizes: "", colors: "", badge: "",
  inStock: true, isFeatured: false, isVisible: true, stock: "0",
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

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={onChange}
        className={`relative w-10 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-violet-600" : "bg-gray-300"}`}
        style={{ height: "22px" }}
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
}

// ─── Product Modal ────────────────────────────────────────────────────────────

function ProductModal({
  product, categories, categoriesLoading, onClose, onSave,
}: {
  product: Product | null;
  categories: Category[];
  categoriesLoading: boolean;
  onClose: () => void;
  onSave: (data: Partial<Product>, id?: string) => Promise<void>;
}) {
  const [form, setForm] = useState<ProductForm>(() =>
    product ? {
      name: product.name, description: product.description,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      category: typeof product.category === "object" ? product.category._id : product.category,
      images: product.images.join(", "),
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", "),
      badge: product.badge ?? "",
      inStock: product.inStock,
      isFeatured: product.isFeatured ?? false,
      isVisible: product.isVisible ?? true,
      stock: String(product.stock ?? 0),
    } : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        name: form.name, description: form.description,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        category: form.category,
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
        badge: (form.badge || undefined) as Product["badge"],
        inStock: form.inStock,
        isFeatured: form.isFeatured,
        isVisible: form.isVisible,
        stock: Number(form.stock) || 0,
      }, product?._id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{product ? "Edit Product" : "New Product"}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{product ? "Update product details" : "Add a product to your store"}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form id="product-form" onSubmit={submit} className="flex-1 overflow-y-auto px-7 py-5">
          <div className="space-y-4">
            <Field label="Product Name *">
              <input name="name" required value={form.name} onChange={set} placeholder="e.g. Classic Linen Shirt" className="form-input" />
            </Field>
            <Field label="Description *">
              <textarea name="description" required rows={3} value={form.description} onChange={set} className="form-input resize-none" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price ($) *">
                <input name="price" type="number" min="0" step="0.01" required value={form.price} onChange={set} className="form-input" />
              </Field>
              <Field label="Original Price ($)">
                <input name="originalPrice" type="number" min="0" step="0.01" value={form.originalPrice} onChange={set} placeholder="Leave blank if none" className="form-input placeholder-gray-300" />
              </Field>
              <Field label="Category *">
                <select
                  name="category"
                  required
                  value={form.category}
                  onChange={set}
                  disabled={categoriesLoading || categories.length === 0}
                  className="form-input bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {categoriesLoading ? (
                    <option value="">Loading categories…</option>
                  ) : categories.length === 0 ? (
                    <option value="">No categories found</option>
                  ) : (
                    <>
                      <option value="">Select a category…</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </>
                  )}
                </select>
                {!categoriesLoading && categories.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    No categories yet.{" "}
                    <a href="/admin/categories" target="_blank" className="underline font-semibold hover:text-amber-700">
                      Create one first →
                    </a>
                  </p>
                )}
              </Field>
              <Field label="Badge">
                <select name="badge" value={form.badge} onChange={set} className="form-input bg-white">
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Sale">Sale</option>
                  <option value="Best Seller">Best Seller</option>
                </select>
              </Field>
            </div>
            <Field label="Image URLs (comma-separated) *">
              <input name="images" required value={form.images} onChange={set} placeholder="https://…, https://…" className="form-input placeholder-gray-300" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sizes">
                <input name="sizes" value={form.sizes} onChange={set} placeholder="S, M, L, XL" className="form-input placeholder-gray-300" />
              </Field>
              <Field label="Colors">
                <input name="colors" value={form.colors} onChange={set} placeholder="Black, White" className="form-input placeholder-gray-300" />
              </Field>
            </div>

            <Field label="Stock Quantity">
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={set}
                placeholder="0"
                className="form-input"
              />
              <p className="text-[11px] text-gray-400 mt-1">How many units are currently available</p>
            </Field>

            <div className="pt-1 space-y-3 border-t border-gray-100">
              <Toggle checked={form.inStock} onChange={() => setForm((p) => ({ ...p, inStock: !p.inStock }))} label="In Stock" />
              <Toggle checked={form.isFeatured} onChange={() => setForm((p) => ({ ...p, isFeatured: !p.isFeatured }))} label="Featured Product" />
              <Toggle checked={form.isVisible} onChange={() => setForm((p) => ({ ...p, isVisible: !p.isVisible }))} label="Visible on Frontend" />
            </div>
          </div>
        </form>

        <div className="flex gap-3 px-7 py-5 border-t border-gray-100">
          <button type="button" onClick={onClose}
            className="flex-1 px-5 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" form="product-form" disabled={saving}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl text-sm font-bold hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
            {product ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const BADGE_STYLE: Record<string, string> = {
  "New": "bg-blue-50 text-blue-700",
  "Sale": "bg-rose-50 text-rose-700",
  "Best Seller": "bg-amber-50 text-amber-700",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

function ProductsContent() {
  const { apiFetch } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState<Product | null | "new">(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        data: Product[];
        pagination: { total: number; pages: number };
      }>(`/admin/products?page=${page}&limit=12`);
      setProducts(res.data);
      setPagination({ total: res.pagination.total, pages: res.pagination.pages });
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [apiFetch, page]);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; data: Category[] }>("/categories");
      setCategories(res.data);
    } catch {
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleSave = async (data: Partial<Product>, id?: string) => {
    try {
      if (id) {
        await apiFetch(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
        showToast("success", "Product updated");
      } else {
        await apiFetch("/products", { method: "POST", body: JSON.stringify(data) });
        showToast("success", "Product created");
      }
      setModalProduct(null);
      fetchProducts();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Save failed");
      throw e;
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await apiFetch(`/products/${deleteId}`, { method: "DELETE" });
      showToast("success", "Product deleted");
      setDeleteId(null);
      fetchProducts();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const toggleVisibility = async (product: Product) => {
    try {
      await apiFetch(`/products/${product._id}`, {
        method: "PUT",
        body: JSON.stringify({ isVisible: !product.isVisible }),
      });
      setProducts((prev) => prev.map((p) => p._id === product._id ? { ...p, isVisible: !p.isVisible } : p));
      showToast("success", product.isVisible ? "Product hidden from store" : "Product visible on store");
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Update failed");
    }
  };

  return (
    <div className="p-8 space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-400 font-medium">{pagination.total} products in store</p>
        <button
          onClick={() => setModalProduct("new")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-violet-700 hover:to-indigo-700 transition-all hover:shadow-lg hover:shadow-violet-300/40 hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-[2.5px] border-slate-200 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            <p className="text-sm font-medium">No products yet</p>
            <button onClick={() => setModalProduct("new")} className="mt-3 text-violet-600 text-sm hover:underline font-bold">Add your first product →</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Product", "Category", "Price", "Badge", "Stock Qty", "Orders", "Featured", "Visible", ""].map((h) => (
                    <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.08em] px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((p) => (
                  <tr key={p._id} className={`hover:bg-violet-50/20 transition-colors duration-100 group ${!p.isVisible ? "opacity-60" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 relative flex-shrink-0">
                          {p.images[0] ? (
                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="44px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 max-w-[180px] truncate">{p.name}</p>
                          <p className="text-xs text-slate-400 max-w-[180px] truncate">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 font-medium capitalize">
                      {typeof p.category === "object" ? p.category.name : p.category}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-black text-slate-900">৳{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-slate-400 line-through ml-1.5">৳{p.originalPrice}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {p.badge ? (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${BADGE_STYLE[p.badge] ?? "bg-gray-100 text-gray-600"}`}>
                          {p.badge}
                        </span>
                      ) : <span className="text-gray-300 text-sm">—</span>}
                    </td>
                    {/* Stock Qty */}
                    <td className="px-5 py-4">
                      {(() => {
                        const qty = p.stock ?? 0;
                        if (!p.inStock) return <span className="text-xs font-semibold text-red-500">Out of stock</span>;
                        if (qty === 0) return <span className="text-xs text-slate-400">—</span>;
                        const color = qty <= 3 ? "text-red-600 font-bold" : qty <= 10 ? "text-amber-600 font-semibold" : "text-emerald-700 font-semibold";
                        return <span className={`text-sm ${color}`}>{qty}</span>;
                      })()}
                    </td>
                    {/* Total Ordered */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-slate-700">
                        {(p.totalOrdered ?? 0).toLocaleString()}
                      </span>
                    </td>
                    {/* Featured */}
                    <td className="px-5 py-4">
                      {p.isFeatured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          Yes
                        </span>
                      ) : <span className="text-gray-300 text-sm">—</span>}
                    </td>
                    {/* Visibility toggle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleVisibility(p)}
                        title={p.isVisible ? "Click to hide from store" : "Click to show on store"}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          p.isVisible
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.isVisible ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {p.isVisible ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                        <button
                          onClick={() => setModalProduct(p)}
                          className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(p._id)}
                          className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
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

      {modalProduct !== null && (
        <ProductModal
          product={modalProduct === "new" ? null : modalProduct}
          categories={categories}
          categoriesLoading={categoriesLoading}
          onClose={() => setModalProduct(null)}
          onSave={handleSave}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product</h3>
            <p className="text-sm text-gray-500 mb-7">This will permanently remove the product from your store.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-5 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 px-5 py-3 bg-red-600 text-white rounded-2xl text-sm font-semibold hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {deleting && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return <AdminAuthGuard><ProductsContent /></AdminAuthGuard>;
}
