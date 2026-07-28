"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  is_replied: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/contacts/", {
        params: filter === "unread" ? { unread_only: true } : {},
      });
      setMessages(res.data);
    } catch {
      // interceptor handles 401; anything else just shows empty state
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  async function patch(id: number, data: Partial<Pick<ContactMessage, "is_read" | "is_replied">>) {
    const res = await api.patch(`/api/admin/contacts/${id}`, data);
    setMessages((prev) => prev.map((m) => (m.id === id ? res.data : m)));
  }

  async function handleExpand(m: ContactMessage) {
    const next = expandedId === m.id ? null : m.id;
    setExpandedId(next);
    if (next && !m.is_read) {
      try { await patch(m.id, { is_read: true }); } catch { /* non-fatal */ }
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this message permanently?")) return;
    try {
      await api.delete(`/api/admin/contacts/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert("Failed to delete message");
    }
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">
            Contact form submissions{filter === "all" && unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                filter === f ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f === "all" ? "All" : "Unread"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 py-16 text-center">Loading…</p>
      ) : messages.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl py-16 text-center text-gray-400">
          {filter === "unread" ? "No unread messages 🎉" : "No messages yet."}
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => {
            const expanded = expandedId === m.id;
            return (
              <div
                key={m.id}
                className={`bg-white border rounded-xl overflow-hidden transition-shadow ${
                  m.is_read ? "border-gray-200" : "border-blue-300 shadow-sm"
                }`}
              >
                {/* row header */}
                <button
                  onClick={() => handleExpand(m)}
                  className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50"
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${m.is_read ? "bg-gray-300" : "bg-blue-500"}`}
                    title={m.is_read ? "Read" : "Unread"}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm truncate ${m.is_read ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>
                        {m.name}
                      </span>
                      <span className="text-xs text-gray-400 truncate">&lt;{m.email}&gt;</span>
                      {m.is_replied && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">
                          Replied
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      {m.subject || m.message.slice(0, 80)}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(m.created_at).toLocaleDateString()}{" "}
                    {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </button>

                {/* expanded body */}
                {expanded && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    {m.subject && (
                      <p className="text-sm font-semibold text-gray-800 mt-4">{m.subject}</p>
                    )}
                    <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap leading-relaxed">
                      {m.message}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-5">
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "your message"}`)}`}
                        onClick={() => patch(m.id, { is_replied: true }).catch(() => {})}
                        className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Reply via Email
                      </a>
                      <button
                        onClick={() => patch(m.id, { is_replied: !m.is_replied }).catch(() => {})}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                      >
                        {m.is_replied ? "Mark Not Replied" : "Mark Replied"}
                      </button>
                      <button
                        onClick={() => patch(m.id, { is_read: false }).catch(() => {})}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                      >
                        Mark Unread
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="px-4 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 ml-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
