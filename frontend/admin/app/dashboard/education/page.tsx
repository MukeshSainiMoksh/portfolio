"use client";

import { useEffect, useState, FormEvent } from "react";
import api from "@/services/api";

interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string | null;
  year: string | null;
  grade: string | null;
  type: string;
  display_order: number;
}

const emptyForm = { degree: "", institution: "", location: "", year: "", grade: "", type: "degree", display_order: 0 };

export default function EducationPage() {
  const [items, setItems] = useState<Education[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await api.get("/api/admin/content/education");
    setItems(res.data);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/admin/content/education/${editId}`, form);
      } else {
        await api.post("/api/admin/content/education", form);
      }
      setMessage("Saved.");
      setForm(emptyForm);
      setEditId(null);
      load();
    } catch {
      setMessage("Failed to save.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete?")) return;
    await api.delete(`/api/admin/content/education/${id}`);
    load();
  }

  function startEdit(item: Education) {
    setEditId(item.id);
    setForm({ degree: item.degree, institution: item.institution, location: item.location ?? "", year: item.year ?? "", grade: item.grade ?? "", type: item.type, display_order: item.display_order });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Education</h1>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">{editId ? "Edit" : "Add"} Education</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Degree / Certification *</label>
            <input className="input" value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })} required />
          </div>
          <div>
            <label className="label">Institution *</label>
            <input className="input" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} required />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="label">Year</label>
            <input className="input" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2020" />
          </div>
          <div>
            <label className="label">Grade / GPA</label>
            <input className="input" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="degree">Degree</option>
              <option value="certification">Certification</option>
              <option value="course">Course</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="btn-primary">{editId ? "Update" : "Add"}</button>
            {editId && <button type="button" className="btn-secondary" onClick={() => { setEditId(null); setForm(emptyForm); }}>Cancel</button>}
          </div>
        </form>
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Education List</h2>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{item.degree}</p>
                <p className="text-sm text-gray-600">{item.institution} {item.year && `· ${item.year}`}</p>
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded capitalize">{item.type}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(item)} className="text-blue-600 hover:underline text-sm">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No education entries yet.</p>}
        </div>
      </div>
    </div>
  );
}
