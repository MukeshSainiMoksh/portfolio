"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";

export default function Header() {
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
      <p className="text-sm text-gray-500">Manage your portfolio content</p>
      <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
        Logout
      </button>
    </header>
  );
}
