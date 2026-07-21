"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

interface Stats {
  skills: number;
  projects: number;
  experience: number;
  education: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ skills: 0, projects: 0, experience: 0, education: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [skills, projects, experience, education] = await Promise.all([
          api.get("/api/admin/content/skills"),
          api.get("/api/admin/content/projects"),
          api.get("/api/admin/content/experience"),
          api.get("/api/admin/content/education"),
        ]);
        setStats({
          skills: skills.data.length,
          projects: projects.data.length,
          experience: experience.data.length,
          education: education.data.length,
        });
      } catch {
        // silently fail — stats are non-critical
      }
    }
    load();
  }, []);

  const cards = [
    { label: "Skills", value: stats.skills, href: "/dashboard/content", color: "bg-blue-500" },
    { label: "Projects", value: stats.projects, href: "/dashboard/projects", color: "bg-green-500" },
    { label: "Experience", value: stats.experience, href: "/dashboard/experience", color: "bg-purple-500" },
    { label: "Education", value: stats.education, href: "/dashboard/education", color: "bg-orange-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <a key={card.label} href={card.href} className="card hover:shadow-md transition-shadow">
            <div className={`${card.color} text-white text-2xl font-bold w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
              {card.value}
            </div>
            <p className="text-gray-600 text-sm font-medium">{card.label}</p>
          </a>
        ))}
      </div>

      <div className="mt-8 card">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Links</h2>
        <ul className="space-y-2 text-sm text-blue-600">
          <li><a href="/dashboard/content" className="hover:underline">Manage Profile Content</a></li>
          <li><a href="/dashboard/projects" className="hover:underline">Manage Projects</a></li>
          <li><a href="/dashboard/experience" className="hover:underline">Manage Experience</a></li>
          <li><a href="/dashboard/education" className="hover:underline">Manage Education</a></li>
          <li><a href="/dashboard/media" className="hover:underline">Media Library</a></li>
        </ul>
      </div>
    </div>
  );
}
