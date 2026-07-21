"use client";

import { useEffect, useState, FormEvent } from "react";
import api from "@/services/api";

interface Project {
  id: number;
  title: string;
  tagline: string | null;
  description: string | null;
  technologies: string[] | null;
  live_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

const emptyForm = {
  title: "", tagline: "", description: "", role: "", duration: "",
  technologies: "", live_url: "", github_url: "", is_featured: false, display_order: 0,
};

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/content/projects");
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
      technologies: form.technologies ? form.technologies.split(",").map(t => t.trim()) : [],
    };
    try {
      if (editId) {
        await api.put(`/api/admin/content/projects/${editId}`, payload);
        setMessage("Project updated.");
      } else {
        await api.post("/api/admin/content/projects", payload);
        setMessage("Project created.");
      }
      setForm(emptyForm);
      setEditId(null);
      load();
    } catch {
      setMessage("Failed to save.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    await api.delete(`/api/admin/content/projects/${id}`);
    load();
  }

  function startEdit(item: Project) {
    setEditId(item.id);
    setForm({
      title: item.title,
      tagline: item.tagline ?? "",
      description: item.description ?? "",
      role: "",
      duration: "",
      technologies: item.technologies?.join(", ") ?? "",
      live_url: item.live_url ?? "",
      github_url: item.github_url ?? "",
      is_featured: item.is_featured,
      display_order: item.display_order,
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Projects</h1>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">{editId ? "Edit Project" : "Add Project"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Title *</label>
            <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">Tagline</label>
            <input className="input" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Technologies (comma-separated)</label>
            <input className="input" value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, PostgreSQL" />
          </div>
          <div>
            <label className="label">Live URL</label>
            <input className="input" type="url" value={form.live_url} onChange={e => setForm({ ...form, live_url: e.target.value })} />
          </div>
          <div>
            <label className="label">GitHub URL</label>
            <input className="input" type="url" value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} />
          </div>
          <div>
            <label className="label">Display Order</label>
            <input className="input" type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: +e.target.value })} />
          </div>
          <div className="flex items-center gap-2 mt-5">
            <input type="checkbox" id="featured" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Project</label>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="btn-primary">{editId ? "Update" : "Add"}</button>
            {editId && <button type="button" className="btn-secondary" onClick={() => { setEditId(null); setForm(emptyForm); }}>Cancel</button>}
          </div>
        </form>
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">All Projects</h2>
        {loading ? <p className="text-gray-400 text-sm">Loading...</p> : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.tagline}</p>
                  {item.technologies && <p className="text-xs text-blue-600 mt-1">{item.technologies.join(", ")}</p>}
                </div>
                <div className="flex gap-2">
                  {item.is_featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Featured</span>}
                  <button onClick={() => startEdit(item)} className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No projects yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
