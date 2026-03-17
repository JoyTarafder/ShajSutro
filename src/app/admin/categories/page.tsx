"use client";

import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

type CategoryForm = { name: string; description: string; image: string };
const EMPTY_FORM: CategoryForm = { name: "", description: "", image: "" };

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium ${type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}
    >
      {type === "success" ? (
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
      {msg}
    </div>
  );
}

// ─── Category Modal ───────────────────────────────────────────────────────────

function CategoryModal({
  category,
  parentName,
  onClose,
  onSave,
}: {
  category: Category | null;
  parentName?: string;
  onClose: () => void;
  onSave: (data: CategoryForm, id?: string) => Promise<void>;
}) {
  const [form, setForm] = useState<CategoryForm>(() =>
    category
      ? {
          name: category.name,
          description: category.description ?? "",
          image: category.image ?? "",
        }
      : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form, category?._id);
    } finally {
      setSaving(false);
    }
  };

  const isSubcategory = !!parentName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {category
                ? `Edit ${isSubcategory ? "Sub-category" : "Category"}`
                : `New ${isSubcategory ? "Sub-category" : "Category"}`}
            </h2>
            {parentName && (
              <p className="text-xs text-gray-400 mt-0.5">
                Under:{" "}
                <span className="font-semibold text-gray-600">
                  {parentName}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="px-7 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Name *
            </label>
            <input
              name="name"
              required
              value={form.name}
              onChange={set}
              placeholder="e.g. T-Shirts"
              className="form-input w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={set}
              placeholder="Brief description…"
              className="form-input w-full resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Image URL
            </label>
            <input
              name="image"
              type="url"
              value={form.image}
              onChange={set}
              placeholder="https://…"
              className="form-input w-full"
            />
            {form.image && (
              <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl text-sm font-bold hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving && (
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {category ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({
  name,
  deleting,
  onCancel,
  onConfirm,
}: {
  name: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-5">
          <svg
            className="w-7 h-7 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete?</h3>
        <p className="text-sm text-gray-500 mb-1">
          Delete <span className="font-semibold text-gray-800">{name}</span>?
        </p>
        <p className="text-xs text-gray-400 mb-7">
          Cannot delete if it has products or subcategories.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-5 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-5 py-3 bg-red-600 text-white rounded-2xl text-sm font-semibold hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting && (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────

function CategoryCard({
  cat,
  showSubBtn,
  onEdit,
  onDelete,
  onManageSub,
  onManageProducts,
}: {
  cat: Category;
  showSubBtn: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onManageSub?: () => void;
  onManageProducts?: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden group hover:shadow-md transition-shadow">
      <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
        {cat.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
          {cat.slug}
        </p>
        {cat.description && (
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
            {cat.description}
          </p>
        )}
        {cat.productCount !== undefined && (
          <p className="text-xs text-slate-400 mt-1">
            {cat.productCount} products
          </p>
        )}
        <div className="flex items-center gap-2 mt-4">
          {showSubBtn && (
            <button
              onClick={onManageSub}
              className="flex-1 px-3 py-2 text-xs font-bold text-violet-700 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors flex items-center justify-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h10M4 18h7"
                />
              </svg>
              Sub-categories
            </button>
          )}
          {!showSubBtn && (
            <button
              onClick={onManageProducts}
              className="flex-1 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
              Products
            </button>
          )}
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────

function CategoriesContent() {
  const { apiFetch } = useAdminAuth();
  const router = useRouter();

  // root categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // selected parent for sub-category drill-down
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  // modal & delete state
  const [modal, setModal] = useState<Category | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch root categories ──
  const fetchCategories = useCallback(async () => {
    setLoadingCats(true);
    try {
      const res = await apiFetch<{ success: boolean; data: Category[] }>(
        "/categories",
      );
      setCategories(res.data);
    } catch (e: unknown) {
      showToast(
        "error",
        e instanceof Error ? e.message : "Failed to load categories",
      );
    } finally {
      setLoadingCats(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ── Fetch subcategories when a parent is selected ──
  const fetchSubcategories = useCallback(
    async (parentId: string) => {
      setLoadingSubs(true);
      try {
        const res = await apiFetch<{ success: boolean; data: Category[] }>(
          `/categories/subcategories/${parentId}`,
        );
        setSubcategories(res.data);
      } catch (e: unknown) {
        showToast(
          "error",
          e instanceof Error ? e.message : "Failed to load sub-categories",
        );
      } finally {
        setLoadingSubs(false);
      }
    },
    [apiFetch],
  );

  const openSubPanel = (cat: Category) => {
    setSelectedParent(cat);
    fetchSubcategories(cat._id);
  };

  const closeSubPanel = () => {
    setSelectedParent(null);
    setSubcategories([]);
    setModal(null);
  };

  // ── Save (create / update) ──
  const handleSave = async (data: CategoryForm, id?: string) => {
    try {
      if (id) {
        await apiFetch(`/categories/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        showToast("success", "Updated");
      } else {
        if (selectedParent) {
          await apiFetch(`/categories/${selectedParent._id}/subcategories`, {
            method: "POST",
            body: JSON.stringify(data),
          });
        } else {
          await apiFetch("/categories", {
            method: "POST",
            body: JSON.stringify(data),
          });
        }
        showToast("success", "Created");
      }
      setModal(null);
      if (selectedParent) fetchSubcategories(selectedParent._id);
      else fetchCategories();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Save failed");
      throw e;
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/categories/${deleteTarget._id}`, { method: "DELETE" });
      showToast("success", "Deleted");
      setDeleteTarget(null);
      if (selectedParent) fetchSubcategories(selectedParent._id);
      else fetchCategories();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const isSubView = !!selectedParent;
  const activeList = isSubView ? subcategories : categories;
  const activeLoading = isSubView ? loadingSubs : loadingCats;

  return (
    <div className="p-8 space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isSubView && (
            <button
              onClick={closeSubPanel}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Categories
            </button>
          )}
          {isSubView && <span className="text-slate-300">/</span>}
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {isSubView ? (
                <span className="flex items-center gap-2">
                  <span className="text-slate-400">{selectedParent.name}</span>
                  <span className="text-slate-300">›</span>
                  Sub-categories
                </span>
              ) : (
                "Categories"
              )}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {activeList.length} {isSubView ? "sub-categor" : "categor"}
              {activeList.length !== 1 ? "ies" : "y"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setModal("new")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-violet-700 hover:to-indigo-700 transition-all hover:shadow-lg hover:shadow-violet-300/40 hover:-translate-y-0.5"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          {isSubView ? "Add Sub-category" : "Add Category"}
        </button>
      </div>

      {/* Grid */}
      {activeLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-[2.5px] border-slate-200 border-t-violet-500 rounded-full animate-spin" />
        </div>
      ) : activeList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <svg
            className="w-12 h-12 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
            />
          </svg>
          <p className="text-sm font-medium">
            No {isSubView ? "sub-categories" : "categories"} yet
          </p>
          <button
            onClick={() => setModal("new")}
            className="mt-3 text-violet-600 text-sm hover:underline font-bold"
          >
            Create {isSubView ? "first sub-category" : "first category"} →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeList.map((cat) => (
            <CategoryCard
              key={cat._id}
              cat={cat}
              showSubBtn={!isSubView}
              onEdit={() => setModal(cat)}
              onDelete={() => setDeleteTarget(cat)}
              onManageSub={() => openSubPanel(cat)}
              onManageProducts={() =>
                router.push(
                  `/admin/products?category=${cat._id}&categoryName=${encodeURIComponent(cat.name)}`,
                )
              }
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {modal !== null && (
        <CategoryModal
          category={modal === "new" ? null : modal}
          parentName={isSubView ? selectedParent?.name : undefined}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <AdminAuthGuard>
      <CategoriesContent />
    </AdminAuthGuard>
  );
}
