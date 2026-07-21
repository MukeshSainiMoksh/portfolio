"use client";

import { useEffect, useState, FormEvent } from "react";
import api from "@/services/api";

interface Certification {
  id: number;
  name: string;
  issuer: string;
  credential_id: string | null;
  credential_url: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

const emptyForm = {
  name: "",
  issuer: "",
  credential_id: "",
  credential_url: "",
  issue_date: "",
  expiry_date: "",
  description: "",
  display_order: 0,
};

export default function CertificationsPage() {
  const [items, setItems] = useState<Certification[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/certifications/");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      issue_date: form.issue_date || null,
      expiry_date: form.expiry_date || null,
      credential_id: form.credential_id || null,
      credential_url: form.credential_url || null,
      description: form.description || null,
    };
    try {
      if (editId) {
        await api.put(`/api/admin/certifications/${editId}`, payload);
        setMessage("Certification updated.");
      } else {
        await api.post("/api/admin/certifications/", payload);
        setMessage("Certification added.");
      }
      setForm(emptyForm);
      setEditId(null);
      load();
    } catch {
      setMessage("Failed to save.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this certification?")) return;
    await api.delete(`/api/admin/certifications/${id}`);
    load();
  }

  function startEdit(item: Certification) {
    setEditId(item.id);
    setForm({
      name: item.name,
      issuer: item.issuer,
      credential_id: item.credential_id ?? "",
      credential_url: item.credential_url ?? "",
      issue_date: item.issue_date ?? "",
      expiry_date: item.expiry_date ?? "",
      description: item.description ?? "",
      display_order: item.display_order,
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Certifications</h1>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {editId ? "Edit Certification" : "Add Certification"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Certification Name *</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Microsoft Certified: Azure AI Engineer Associate"
              required
            />
          </div>
          <div>
            <label className="label">Issuer *</label>
            <input
              className="input"
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              placeholder="e.g. Microsoft"
              required
            />
          </div>
          <div>
            <label className="label">Credential ID</label>
            <input
              className="input"
              value={form.credential_id}
              onChange={(e) => setForm({ ...form, credential_id: e.target.value })}
              placeholder="e.g. A76EDCB4BBE3F103"
            />
          </div>
          <div>
            <label className="label">Credential URL</label>
            <input
              className="input"
              type="url"
              value={form.credential_url}
              onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="label">Issue Date</label>
            <input
              className="input"
              type="date"
              value={form.issue_date}
              onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Expiry Date</label>
            <input
              className="input"
              type="date"
              value={form.expiry_date}
              onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the certification..."
            />
          </div>
          <div>
            <label className="label">Display Order</label>
            <input
              className="input"
              type="number"
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: +e.target.value })}
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="btn-primary">
              {editId ? "Update" : "Add"}
            </button>
            {editId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { setEditId(null); setForm(emptyForm); }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">All Certifications</h2>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-blue-600 font-medium">{item.issuer}</p>
                  {item.credential_id && (
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      ID: {item.credential_id}
                    </p>
                  )}
                  {(item.issue_date || item.expiry_date) && (
                    <p className="text-xs text-gray-400 mt-1">
                      {item.issue_date} {item.expiry_date ? `→ ${item.expiry_date}` : ""}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-6">
                No certifications yet. Add your first one above.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
