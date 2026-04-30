"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Switch } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { signOut } from "@/lib/firebase/auth";
import {
  listenUserNotifications,
  markNotificationRead,
  markNotificationsRead,
} from "@/lib/firebase/firestore";
import { useAuth } from "@/lib/hooks/useAuth";
import type { AppNotification } from "@/types/notification";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/tim-phong", label: "Tìm phòng" },
  { href: "/ve-chung-toi", label: "Về chúng tôi" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [avatarImageFailed, setAvatarImageFailed] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, profile, loading, isLandlord, isAdmin } = useAuth();
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsAccountMenuOpen(false);
    setIsNotificationOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    closeMenus();
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setIsAccountMenuOpen(false);
    setIsNotificationOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isAccountMenuOpen && !isNotificationOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
      if (!notificationMenuRef.current?.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isAccountMenuOpen, isNotificationOpen]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    return listenUserNotifications(user.uid, setNotifications);
  }, [user]);

  const displayName = profile?.displayName || user?.displayName || "Tài khoản";
  const displayEmail = profile?.email || user?.email || "";
  const avatarUrl = profile?.avatarUrl || user?.photoURL || "";
  const canShowAvatarImage = Boolean(avatarUrl) && !avatarImageFailed;
  const avatarLetter = (displayName || displayEmail || "U").charAt(0).toUpperCase();
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const unreadNotificationIds = notifications
    .filter((notification) => !notification.read)
    .map((notification) => notification.id);

  useEffect(() => {
    setAvatarImageFailed(false);
  }, [avatarUrl]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:hidden"
              onClick={() => setIsMenuOpen((value) => !value)}
              aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              <Icon icon={isMenuOpen ? "mdi:close" : "mdi:menu"} className="text-2xl" />
            </button>

            <Link href="/" className="flex items-center gap-2" onClick={closeMenus}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/25">
                <Icon icon="mdi:home-search" className="text-xl text-white" />
              </span>
              <span className="flex flex-col">
                <span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-lg font-bold leading-tight text-transparent">
                  NhàTrọ
                </span>
                <span className="-mt-0.5 text-[10px] leading-none text-slate-500 dark:text-slate-400">
                  Phú Thọ
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActiveLink(link.href)
                    ? "text-sky-600 dark:text-sky-400"
                    : "text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center sm:flex">
              <Switch
                size="sm"
                isSelected={theme === "dark"}
                onChange={(value) => setTheme(value ? "dark" : "light")}
              />
            </div>

            {loading ? (
              <div className="h-8 w-8 rounded-full skeleton" />
            ) : user ? (
              <>
                {isLandlord && (
                  <Link href="/quan-ly/tao-bai" className="button button--secondary button--sm hidden md:inline-flex">
                    <Icon icon="mdi:plus" />
                    Đăng phòng
                  </Link>
                )}

                <div className="relative" ref={notificationMenuRef}>
                    <button
                      type="button"
                      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-sky-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => {
                        setIsNotificationOpen((value) => !value);
                        setIsAccountMenuOpen(false);
                      }}
                      aria-label="Mở thông báo"
                      aria-expanded={isNotificationOpen}
                    >
                      <Icon icon="mdi:bell-outline" className="text-xl" />
                      {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>

                    {isNotificationOpen && (
                      <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
                        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">Thông báo</p>
                          {unreadCount > 0 && (
                            <button
                              type="button"
                              className="text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400"
                              onClick={() => markNotificationsRead(unreadNotificationIds)}
                            >
                              Đánh dấu đã đọc
                            </button>
                          )}
                        </div>

                        <div className="max-h-96 overflow-y-auto p-1">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                              <Icon icon="mdi:bell-sleep-outline" className="mx-auto mb-2 text-3xl text-slate-300" />
                              <p className="text-sm text-slate-500">Chưa có thông báo</p>
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <Link
                                key={notification.id}
                                href={notification.link || "#"}
                                className={`block rounded-lg px-3 py-3 transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
                                  notification.read ? "" : "bg-sky-50/80 dark:bg-sky-950/30"
                                }`}
                                onClick={() => {
                                  if (!notification.read) {
                                    void markNotificationRead(notification.id);
                                  }
                                  closeMenus();
                                }}
                              >
                                <div className="flex gap-3">
                                  <span
                                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                      notification.type === "room_rejected"
                                        ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                        : notification.type === "new_room_pending"
                                        ? "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                                        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                                    }`}
                                  >
                                    <Icon
                                      icon={
                                        notification.type === "room_rejected"
                                          ? "mdi:close-circle-outline"
                                          : notification.type === "new_room_pending"
                                          ? "mdi:file-document-plus-outline"
                                          : "mdi:check-decagram-outline"
                                      }
                                    />
                                  </span>
                                  <div className="min-w-0">
                                    <p className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-white">
                                      {notification.title}
                                    </p>
                                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                                      {notification.message}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                <div className="relative" ref={accountMenuRef}>
                  <button
                    type="button"
                    className="relative flex h-9 w-9 items-center justify-center overflow-visible rounded-full border-2 border-sky-200 bg-sky-50 text-sm font-bold text-sky-700 transition hover:ring-2 hover:ring-sky-500/20 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200"
                    onClick={() => setIsAccountMenuOpen((value) => !value)}
                    aria-label="Mở menu tài khoản"
                    aria-expanded={isAccountMenuOpen}
                  >
                    <div className="h-full w-full rounded-full overflow-hidden flex items-center justify-center">
                      {canShowAvatarImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={() => setAvatarImageFailed(true)}
                        />
                      ) : (
                        avatarLetter
                      )}
                    </div>
                    {isAdmin && (
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 border-2 border-white dark:border-slate-900">
                        <Icon icon="mdi:shield-crown" className="text-[8px] text-white" />
                      </span>
                    )}
                  </button>

                  {isAccountMenuOpen && (
                    <div className="absolute right-0 top-11 z-50 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
                      <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{displayName}</p>
                        <p className="truncate text-xs text-slate-500">{displayEmail}</p>
                      </div>

                      <div className="p-1">
                        {isLandlord && (
                          <Link
                            href="/quan-ly"
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Icon icon="mdi:view-dashboard" />
                            Quản lý phòng
                          </Link>
                        )}
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Icon icon="mdi:shield-crown" />
                            Admin
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                        >
                          <Icon icon="mdi:logout" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/dang-nhap" className="button button--ghost button--sm hidden sm:inline-flex">
                  Đăng nhập
                </Link>
                <Link href="/dang-ky" className="button button--primary button--sm font-semibold shadow-lg shadow-sky-500/25">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 shadow-lg dark:border-slate-800 dark:bg-slate-950 sm:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-base font-medium ${
                  isActiveLink(link.href)
                    ? "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
                onClick={closeMenus}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2 px-3 py-2">
            <Icon icon="mdi:weather-sunny" className="text-slate-400" />
            <Switch size="sm" isSelected={theme === "dark"} onChange={(value) => setTheme(value ? "dark" : "light")} />
            <Icon icon="mdi:weather-night" className="text-slate-400" />
          </div>

          {user ? (
            <div className="mt-2 grid gap-2 px-3">
              {isLandlord && (
                <Link href="/quan-ly" className="button button--secondary button--full-width" onClick={closeMenus}>
                  Quản lý phòng
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin" className="button button--secondary button--full-width" onClick={closeMenus}>
                  Admin
                </Link>
              )}
              <button type="button" className="button button--danger-soft button--full-width" onClick={handleSignOut}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2 px-3">
              <Link href="/dang-nhap" className="button button--outline button--full-width" onClick={closeMenus}>
                Đăng nhập
              </Link>
              <Link href="/dang-ky" className="button button--primary button--full-width" onClick={closeMenus}>
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
