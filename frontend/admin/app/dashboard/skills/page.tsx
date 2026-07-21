"use client";

import { useEffect, useState, FormEvent } from "react";
import api from "@/services/api";

interface Skill {
  id: number;
  category: string;
  skill_name: string;
  skill_level: number;
  icon_class: string | null;
  display_order: number;
  is_active: boolean;
}

const emptyForm = {
  category: "",
  skill_name: "",
  skill_level: 80,
  icon_class: "",
  display_order: 0,
};

const SUGGESTED_CATEGORIES = [
  "Languages",
  "Frameworks & Libraries",
  "AI & Machine Learning",
  "Cloud & DevOps",
  "Tools",
];

export default function SkillsPage() {
  const [items, setItems] = useState<Skill[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/content/skills");
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
      icon_class: form.icon_class || null,
    };
    try {
      if (editId) {
        await api.put(`/api/admin/content/skills/${editId}`, payload);
        setMessage("Skill updated.");
      } else {
        await api.post("/api/admin/content/skills", payload);
        setMessage("Skill added.");
      }
      setForm(emptyForm);
      setEditId(null);
      load();
    } catch {
      setMessage("Failed to save.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this skill?")) return;
    await api.delete(`/api/admin/content/skills/${id}`);
    load();
  }

  function startEdit(item: Skill) {
    setEditId(item.id);
    setForm({
      category: item.category,
      skill_name: item.skill_name,
      skill_level: item.skill_level,
      icon_class: item.icon_class ?? "",
      display_order: item.display_order,
    });
  }

  const categories = ["all", ...Array.from(new Set(items.map((s) => s.category)))];
  const filtered =
    filterCategory === "all" ? items : items.filter((s) => s.category === filterCategory);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Skills</h1>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {editId ? "Edit Skill" : "Add Skill"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Category *</label>
            <input
              className="input"
              list="categories"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Languages"
              required
            />
            <datalist id="categories">
              {SUGGESTED_CATEGORIES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div>
            <label className="label">Skill Name *</label>
            <input
              className="input"
              value={form.skill_name}
              onChange={(e) => setForm({ ...form, skill_name: e.target.value })}
              placeholder="e.g. Python"
              required
            />
          </div>
          <div>
            <label className="label">
              Proficiency Level: <span className="text-blue-600 font-bold">{form.skill_level}%</span>
            </label>
            <input
              type="range"
              min={1}
              max={100}
              value={form.skill_level}
              onChange={(e) => setForm({ ...form, skill_level: +e.target.value })}
              className="w-full mt-1 accent-blue-600"
            />
          </div>
          <div>
            <label className="label">Icon Class (optional)</label>
            <input
              className="input"
              value={form.icon_class}
              onChange={(e) => setForm({ ...form, icon_class: e.target.value })}
              placeholder="e.g. fab fa-python"
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
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-semibold">All Skills ({items.length})</h2>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filterCategory === c
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{item.skill_name}</span>
                      <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${item.skill_level}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{item.skill_level}%</span>
                    </div>
                  </div>
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
            {filtered.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-6">
                No skills found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
