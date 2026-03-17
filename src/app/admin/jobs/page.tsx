"use client";

import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useCallback, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  level: "Junior" | "Mid" | "Senior" | "Lead";
  description?: string;
  deadline?: string | null;
  bullets: string[];
  isActive: boolean;
  createdAt: string;
}

type JobForm = {
  title: string;
  department: string;
  location: string;
  type: Job["type"];
  level: Job["level"];
  description: string;
  deadline: string;
  bullets: string[];
  isActive: boolean;
};

const EMPTY_FORM: JobForm = {
  title: "",
  department: "",
  location: "",
  type: "Full-time",
  level: "Mid",
  description: "",
  deadline: "",
  bullets: [""],
  isActive: true,
};

const JOB_TYPES: Job["type"][] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];
const JOB_LEVELS: Job["level"][] = ["Junior", "Mid", "Senior", "Lead"];

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

// ─── Job Modal ────────────────────────────────────────────────────────────────

function JobModal({
  job,
  onClose,
  onSave,
}: {
  job: Job | null;
  onClose: () => void;
  onSave: (data: JobForm, id?: string) => Promise<void>;
}) {
  const [form, setForm] = useState<JobForm>(() =>
    job
      ? {
          title: job.title,
          department: job.department,
          location: job.location,
          type: job.type,
          level: job.level,
          description: job.description ?? "",
          deadline: job.deadline ? String(job.deadline).slice(0, 10) : "",
          bullets: job.bullets.length ? job.bullets : [""],
          isActive: job.isActive,
        }
      : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);

  const setField = <K extends keyof JobForm>(k: K, v: JobForm[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const setBullet = (i: number, v: string) =>
    setForm((p) => {
      const b = [...p.bullets];
      b[i] = v;
      return { ...p, bullets: b };
    });

  const addBullet = () =>
    setForm((p) => ({ ...p, bullets: [...p.bullets, ""] }));

  const removeBullet = (i: number) =>
    setForm((p) => ({
      ...p,
      bullets: p.bullets.filter((_, idx) => idx !== i),
    }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(
        {
          ...form,
          deadline: form.deadline.trim() ? form.deadline.trim() : "",
          bullets: form.bullets.filter((b) => b.trim()),
        },
        job?._id,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {job ? "Edit Job" : "New Job Posting"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {job ? "Update job details" : "Create a new career opportunity"}
            </p>
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

        {/* Body */}
        <form
          onSubmit={submit}
          className="flex-1 overflow-y-auto px-7 py-5 space-y-4"
        >
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Job Title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. Frontend Engineer"
              className="form-input w-full"
            />
          </div>

          {/* Dept + Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Department *
              </label>
              <input
                required
                value={form.department}
                onChange={(e) => setField("department", e.target.value)}
                placeholder="e.g. Engineering"
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Location *
              </label>
              <input
                required
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                placeholder="e.g. Remote"
                className="form-input w-full"
              />
            </div>
          </div>

          {/* Type + Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Type *
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setField("type", e.target.value as Job["type"])
                }
                className="form-input w-full"
              >
                {JOB_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Level *
              </label>
              <select
                value={form.level}
                onChange={(e) =>
                  setField("level", e.target.value as Job["level"])
                }
                className="form-input w-full"
              >
                {JOB_LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Deadline
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setField("deadline", e.target.value)}
              className="form-input w-full"
            />
            <p className="mt-1.5 text-[11px] text-gray-400">
              Optional. If set, it will be shown on the careers page.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Job Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Write a short description about responsibilities, requirements, and what success looks like…"
              className="form-input w-full min-h-[120px] resize-y leading-relaxed"
            />
            <p className="mt-1.5 text-[11px] text-gray-400">
              Keep it short — highlights below help candidates scan quickly.
            </p>
          </div>

          {/* Bullets */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Key Highlights
            </label>
            <div className="space-y-2">
              {form.bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={b}
                    onChange={(e) => setBullet(i, e.target.value)}
                    placeholder={`Highlight ${i + 1}`}
                    className="form-input flex-1"
                  />
                  {form.bullets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBullet(i)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addBullet}
                className="text-xs text-violet-600 font-semibold hover:underline flex items-center gap-1 mt-1"
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
                    strokeWidth={2.5}
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add highlight
              </button>
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-2 px-4 rounded-2xl border border-gray-100 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">
              Active (visible on careers page)
            </span>
            <button
              type="button"
              onClick={() => setField("isActive", !form.isActive)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.isActive ? "bg-emerald-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form.isActive ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>

          {/* Actions */}
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
              {job ? "Save Changes" : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page Content ─────────────────────────────────────────────────────────────

function JobsContent() {
  const { apiFetch } = useAdminAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Job | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; data: Job[] }>(
        "/jobs/all",
      );
      setJobs(res.data);
    } catch (e: unknown) {
      showToast(
        "error",
        e instanceof Error ? e.message : "Failed to load jobs",
      );
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSave = async (data: JobForm, id?: string) => {
    try {
      if (id) {
        await apiFetch(`/jobs/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        showToast("success", "Job updated");
      } else {
        await apiFetch("/jobs", { method: "POST", body: JSON.stringify(data) });
        showToast("success", "Job created");
      }
      setModal(null);
      fetchJobs();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Save failed");
      throw e;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/jobs/${deleteTarget._id}`, { method: "DELETE" });
      showToast("success", "Job deleted");
      setDeleteTarget(null);
      fetchJobs();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const levelColor: Record<Job["level"], string> = {
    Junior: "bg-sky-50 text-sky-700 border-sky-200",
    Mid: "bg-violet-50 text-violet-700 border-violet-200",
    Senior: "bg-amber-50 text-amber-700 border-amber-200",
    Lead: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="p-8 space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-400 font-medium">
          {jobs.filter((j) => j.isActive).length} active · {jobs.length} total
        </p>
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
          Post Job
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-[2.5px] border-slate-200 border-t-violet-500 rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
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
              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          <p className="text-sm font-medium">No job postings yet</p>
          <button
            onClick={() => setModal("new")}
            className="mt-3 text-violet-600 text-sm hover:underline font-bold"
          >
            Create first job →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className={`bg-white rounded-2xl border shadow-soft p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-opacity ${!job.isActive ? "opacity-60" : "border-slate-100"}`}
            >
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {job.title}
                  </h3>
                  {!job.isActive && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                      Inactive
                    </span>
                  )}
                  {!!job.deadline && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Deadline:{" "}
                      {new Date(job.deadline).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-1.5">
                  <span className="text-xs text-slate-500">
                    {job.department}
                  </span>
                  <span className="text-slate-300 text-xs">·</span>
                  <span className="text-xs text-slate-500">{job.location}</span>
                  <span className="text-slate-300 text-xs">·</span>
                  <span className="text-xs text-slate-500">{job.type}</span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${levelColor[job.level]}`}
                  >
                    {job.level}
                  </span>
                </div>
                {job.bullets.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {job.bullets.slice(0, 3).map((b, i) => (
                      <span
                        key={i}
                        className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-0.5"
                      >
                        {b}
                      </span>
                    ))}
                    {job.bullets.length > 3 && (
                      <span className="text-[11px] text-slate-400">
                        +{job.bullets.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    handleSave(
                      {
                        title: job.title,
                        department: job.department,
                        location: job.location,
                        type: job.type,
                        level: job.level,
                        description: job.description ?? "",
                        deadline: job.deadline
                          ? String(job.deadline).slice(0, 10)
                          : "",
                        bullets: job.bullets,
                        isActive: !job.isActive,
                      },
                      job._id,
                    )
                  }
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors ${job.isActive ? "text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100" : "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"}`}
                >
                  {job.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => setModal(job)}
                  className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(job)}
                  className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <JobModal
          job={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete Job?
            </h3>
            <p className="text-sm text-gray-500 mb-7">
              Delete{" "}
              <span className="font-semibold text-gray-800">
                {deleteTarget.title}
              </span>
              ? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-5 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <AdminAuthGuard>
      <JobsContent />
    </AdminAuthGuard>
  );
}
