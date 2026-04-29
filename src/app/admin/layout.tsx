"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Navbar from "@/components/ui/Navbar";
import { useAuth } from "@/lib/hooks/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/");
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen"><Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }
  if (!user || !isAdmin) return null;

  const links = [
    { href: "/admin", label: "Tổng quan", icon: "mdi:view-dashboard" },
    { href: "/admin/duyet-bai", label: "Duyệt bài", icon: "mdi:check-decagram" },
    { href: "/admin/quan-ly-user", label: "Người dùng", icon: "mdi:account-group" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
              <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                <p className="font-semibold text-sm flex items-center gap-2">
                  <Icon icon="mdi:shield-crown" className="text-amber-500" />Admin Panel
                </p>
              </div>
              <nav className="space-y-1">
                {links.map((link) => (
                  <Link key={link.href} href={link.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 transition-colors">
                    <Icon icon={link.icon} className="text-lg" />{link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
