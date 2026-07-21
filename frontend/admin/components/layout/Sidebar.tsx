"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profile Content", href: "/dashboard/content" },
  { label: "Skills", href: "/dashboard/skills" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Experience", href: "/dashboard/experience" },
  { label: "Education", href: "/dashboard/education" },
  { label: "Certifications", href: "/dashboard/certifications" },
  { label: "Media", href: "/dashboard/media" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-gray-900 text-gray-100 flex flex-col min-h-screen">
      <div className="px-4 py-5 border-b border-gray-800">
        <span className="font-bold text-lg tracking-tight">Portfolio Admin</span>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 text-sm rounded-lg mx-2 mb-1 transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-800 text-xs text-gray-500">
        Portfolio v2.0
      </div>
    </aside>
  );
}
