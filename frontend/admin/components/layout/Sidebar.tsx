"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/services/api";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Messages", href: "/dashboard/messages" },
  { label: "Profile Content", href: "/dashboard/content" },
  { label: "Skills", href: "/dashboard/skills" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Experience", href: "/dashboard/experience" },
  { label: "Education", href: "/dashboard/education" },
  { label: "Certifications", href: "/dashboard/certifications" },
  { label: "Media", href: "/dashboard/media" },
  { label: "Resume & Video", href: "/dashboard/site-assets" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  // unread badge — refresh on route change so it stays current while navigating
  useEffect(() => {
    api.get("/api/admin/contacts/unread-count")
      .then((r) => setUnread(r.data.unread ?? 0))
      .catch(() => {});
  }, [pathname]);

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
              className={`flex items-center justify-between px-4 py-2.5 text-sm rounded-lg mx-2 mb-1 transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <span>{item.label}</span>
              {item.href === "/dashboard/messages" && unread > 0 && (
                <span className="ml-2 min-w-[20px] h-5 px-1.5 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-semibold">
                  {unread}
                </span>
              )}
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
