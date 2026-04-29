"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import Navbar from "@/components/ui/Navbar";
import { useAuth } from "@/lib/hooks/useAuth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const sidebarLinks = [
  { href: "/quan-ly", label: "Bài đăng của tôi", icon: "mdi:format-list-bulleted" },
  { href: "/quan-ly/tao-bai", label: "Đăng phòng mới", icon: "mdi:plus-circle" },
  { href: "/ho-so", label: "Hồ sơ cá nhân", icon: "mdi:account-circle" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, profile, loading, isLandlord } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isLandlord)) {
      router.push("/dang-nhap");
    }
  }, [user, isLandlord, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user || !isLandlord) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
              <div className="mb-4 p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20">
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{profile?.displayName}</p>
                <p className="text-xs text-slate-500">Chủ nhà trọ</p>
              </div>
              <nav className="space-y-1">
                {sidebarLinks.map((link) => (
                  <Link key={link.href} href={link.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    <Icon icon={link.icon} className="text-lg" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
          {/* Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
