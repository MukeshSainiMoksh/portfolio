"use client";

import { useEffect, useState, FormEvent } from "react";
import api from "@/services/api";

interface Experience {
  id: number;
  job_title: string;
  company: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  technologies: string | null;
  display_order: number;
}

const emptyForm = {
  job_title: "", company: "", location: "", start_date: "", end_date: "",
  is_current: false, description: "", technologies: "", display_order: 0,
};

export default function ExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await api.get("/api/admin/content/experience");
    setItems(res.data);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/admin/content/experience/${editId}`, form);
      } else {
        await api.post("/api/admin/content/experience", form);
      }
      setMessage("Saved successfully.");
      setForm(emptyForm);
      setEditId(null);
      load();
    } catch {
      setMessage("Failed to save.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this experience?")) return;
    await api.delete(`/api/admin/content/experience/${id}`);
    load();
  }

  function startEdit(item: Experience) {
    setEditId(item.id);
    setForm({
      job_title: item.job_title, company: item.company,
      location: item.location ?? "", start_date: item.start_date,
      end_date: item.end_date ?? "", is_current: item.is_current,
      description: item.description ?? "", technologies: item.technologies ?? "",
      display_order: item.display_order,
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Experience</h1>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">{editId ? "Edit Experience" : "Add Experience"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Job Title *</label>
            <input className="input" value={form.job_title} onChange={e => setForm({ ...form, job_title: e.target.value })} required />
          </div>
          <div>
            <label className="label">Company *</label>
            <input className="input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="label">Start Date *</label>
            <input className="input" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} placeholder="Jan 2022" required />
          </div>
          <div>
            <label className="label">End Date</label>
            <input className="input" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} placeholder="Dec 2023" disabled={form.is_current} />
          </div>
          <div className="flex items-center gap-2 mt-5">
            <input type="checkbox" id="current" checked={form.is_current} onChange={e => setForm({ ...form, is_current: e.target.checked })} />
            <label htmlFor="current" className="text-sm font-medium text-gray-700">Currently working here</label>
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Technologies</label>
            <input className="input" value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="React, Python, AWS" />
          </div>
          <div>
            <label className="label">Display Order</label>
            <input className="input" type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: +e.target.value })} />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="btn-primary">{editId ? "Update" : "Add"}</button>
            {editId && <button type="button" className="btn-secondary" onClick={() => { setEditId(null); setForm(emptyForm); }}>Cancel</button>}
          </div>
        </form>
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Experience History</h2>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{item.job_title}</p>
                <p className="text-sm text-gray-600">{item.company} {item.location && `· ${item.location}`}</p>
                <p className="text-xs text-gray-400">{item.start_date} — {item.is_current ? "Present" : item.end_date}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(item)} className="text-blue-600 hover:underline text-sm">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No experience yet.</p>}
        </div>
      </div>
    </div>
  );
}
