"use client";

import { useCallback, useEffect, useState } from "react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface ContactMessage {
  _id: string;
  topic: "general" | "order" | "returns" | "sizing" | "press";
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const TOPIC_LABEL: Record<ContactMessage["topic"], string> = {
  general: "General",
  order: "Order Support",
  returns: "Returns",
  sizing: "Sizing",
  press: "Press / Collab",
};

export default function AdminMessagesPage() {
  return (
    <AdminAuthGuard>
      <MessagesContent />
    </AdminAuthGuard>
  );
}

function MessagesContent() {
  const { apiFetch } = useAdminAuth();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        data: ContactMessage[];
        meta?: { unreadCount?: number };
      }>("/admin/messages?limit=100");
      setMessages(res.data ?? []);
      setUnreadCount(res.meta?.unreadCount ?? 0);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markRead = async (id: string) => {
    await apiFetch(`/admin/messages/${id}/read`, { method: "PUT" });
    setMessages((prev) =>
      prev.map((m) => (m._id === id ? { ...m, isRead: true } : m)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setSelected((prev) => (prev && prev._id === id ? { ...prev, isRead: true } : prev));
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-sm text-gray-500 mt-1">
            Messages sent from the website contact form.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          Unread: {unreadCount}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-sm text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-sm text-gray-500">No messages yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Topic</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">From</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Subject</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {messages.map((msg) => (
                  <tr key={msg._id} className={msg.isRead ? "bg-white" : "bg-indigo-50/30"}>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${msg.isRead ? "bg-gray-100 text-gray-600" : "bg-indigo-100 text-indigo-700"}`}>
                        {msg.isRead ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{TOPIC_LABEL[msg.topic]}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{msg.name}</p>
                      <p className="text-xs text-gray-500">{msg.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-800">{msg.subject}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelected(msg)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          View
                        </button>
                        {!msg.isRead && (
                          <button
                            onClick={() => markRead(msg._id)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Message Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">From</p>
                <p className="font-medium text-gray-900">{selected.name} ({selected.email})</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Topic</p>
                <p className="text-gray-800">{TOPIC_LABEL[selected.topic]}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Subject</p>
                <p className="text-gray-800">{selected.subject}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Message</p>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                {!selected.isRead && (
                  <button
                    onClick={() => markRead(selected._id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
