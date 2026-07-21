"use client";

import { useEffect, useState, FormEvent } from "react";
import api from "@/services/api";

interface ProfileContent {
  id: number;
  section: string;
  field_name: string;
  field_value: string | null;
  field_type: string;
  is_active: boolean;
}

const SECTIONS = ["hero", "about", "contact"];
const FIELD_TYPES = ["text", "textarea", "email", "url", "image"];

export default function ContentPage() {
  const [items, setItems] = useState<ProfileContent[]>([]);
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ section: "hero", field_name: "", field_value: "", field_type: "text" });
  const [editId, setEditId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    try {
      const params = section ? { section } : {};
      const res = await api.get("/api/admin/content/profile", { params });
      setItems(res.data);
    } catch {
      setMessage("Failed to load content.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [section]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/admin/content/profile/${editId}`, form);
        setMessage("Updated successfully.");
      } else {
        await api.post("/api/admin/content/profile", form);
        setMessage("Created successfully.");
      }
      setForm({ section: "hero", field_name: "", field_value: "", field_type: "text" });
      setEditId(null);
      load();
    } catch {
      setMessage("Failed to save.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this content field?")) return;
    await api.delete(`/api/admin/content/profile/${id}`);
    load();
  }

  function startEdit(item: ProfileContent) {
    setEditId(item.id);
    setForm({ section: item.section, field_name: item.field_name, field_value: item.field_value ?? "", field_type: item.field_type });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Content</h1>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">{editId ? "Edit Field" : "Add Field"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Section</label>
            <select className="input" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })}>
              {SECTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Field Name</label>
            <input className="input" value={form.field_name} onChange={e => setForm({ ...form, field_name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Field Type</label>
            <select className="input" value={form.field_type} onChange={e => setForm({ ...form, field_type: e.target.value })}>
              {FIELD_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Value</label>
            {form.field_type === "textarea" ? (
              <textarea className="input" rows={3} value={form.field_value} onChange={e => setForm({ ...form, field_value: e.target.value })} />
            ) : (
              <input className="input" value={form.field_value} onChange={e => setForm({ ...form, field_value: e.target.value })} />
            )}
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="btn-primary">{editId ? "Update" : "Add"}</button>
            {editId && <button type="button" className="btn-secondary" onClick={() => { setEditId(null); setForm({ section: "hero", field_name: "", field_value: "", field_type: "text" }); }}>Cancel</button>}
          </div>
        </form>
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Content Fields</h2>
          <select className="input w-auto" value={section} onChange={e => setSection(e.target.value)}>
            <option value="">All Sections</option>
            {SECTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4">Section</th>
                  <th className="pb-2 pr-4">Field</th>
                  <th className="pb-2 pr-4">Value</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 pr-4 font-medium capitalize">{item.section}</td>
                    <td className="py-2 pr-4">{item.field_name}</td>
                    <td className="py-2 pr-4 text-gray-500 truncate max-w-xs">{item.field_value ?? "—"}</td>
                    <td className="py-2 flex gap-2">
                      <button onClick={() => startEdit(item)} className="text-blue-600 hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={4} className="py-4 text-gray-400 text-center">No content yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
