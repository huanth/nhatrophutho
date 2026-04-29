"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Dropdown, Avatar, Switch } from "@heroui/react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import { useAuth } from "@/lib/hooks/useAuth";
import { signOut } from "@/lib/firebase/auth";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/tim-phong", label: "Tìm phòng" },
  { href: "/ve-chung-toi", label: "Về chúng tôi" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, profile, loading, isLandlord, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand & Mobile toggle */}
          <div className="flex items-center gap-4">
            <button className="sm:hidden p-2 text-slate-600 dark:text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Icon icon={isMenuOpen ? "mdi:close" : "mdi:menu"} className="text-2xl" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/25">
                <Icon icon="mdi:home-search" className="text-white text-xl" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-emerald-500">
                  NhàTrọ
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none -mt-0.5">
                  Phú Thọ
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-sky-600 dark:text-sky-400"
                    : "text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center">
              <Switch
                size="sm"
                isSelected={theme === "dark"}
                onValueChange={(v) => setTheme(v ? "dark" : "light")}
                startContent={<Icon icon="mdi:weather-sunny" />}
                endContent={<Icon icon="mdi:weather-night" />}
                classNames={{ wrapper: "bg-slate-200 dark:bg-slate-700" }}
              />
            </div>

            {loading ? (
              <div className="w-8 h-8 rounded-full skeleton" />
            ) : user ? (
              <>
                {isLandlord && (
                  <Button as={Link} href="/quan-ly/tao-bai" color="primary" variant="flat" size="sm" startContent={<Icon icon="mdi:plus" />} className="hidden md:flex">
                    Đăng phòng
                  </Button>
                )}
                <Dropdown placement="bottom-end">
                  <Dropdown.Trigger>
                    <Avatar
                      as="button"
                      size="sm"
                      src={profile?.avatarUrl || undefined}
                      name={profile?.displayName?.charAt(0) || "U"}
                      className="transition-transform cursor-pointer"
                      isBordered
                      color="primary"
                    />
                  </Dropdown.Trigger>
                  <Dropdown.Menu aria-label="User menu">
                    <Dropdown.Item key="profile-info" isReadOnly className="h-14 gap-2">
                      <p className="font-semibold">{profile?.displayName}</p>
                      <p className="text-xs text-slate-500">{profile?.email}</p>
                    </Dropdown.Item>
                    {isLandlord ? (
                      <Dropdown.Item key="dashboard" as={Link} href="/quan-ly" startContent={<Icon icon="mdi:view-dashboard" />}>
                        Quản lý phòng
                      </Dropdown.Item>
                    ) : null}
                    {isAdmin ? (
                      <Dropdown.Item key="admin" as={Link} href="/admin" startContent={<Icon icon="mdi:shield-crown" />}>
                        Admin
                      </Dropdown.Item>
                    ) : null}
                    <Dropdown.Item key="ho-so" as={Link} href="/ho-so" startContent={<Icon icon="mdi:account" />}>
                      Hồ sơ
                    </Dropdown.Item>
                    <Dropdown.Item key="signout" color="danger" onPress={handleSignOut} startContent={<Icon icon="mdi:logout" />}>
                      Đăng xuất
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button as={Link} href="/dang-nhap" variant="light" size="sm" className="hidden sm:flex text-slate-600 dark:text-slate-300">
                  Đăng nhập
                </Button>
                <Button as={Link} href="/dang-ky" color="primary" size="sm" className="font-semibold shadow-lg shadow-sky-500/25">
                  Đăng ký
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === link.href ? "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400" : "text-slate-600 dark:text-slate-300"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 px-3 py-2">
            <Icon icon="mdi:weather-sunny" className="text-slate-400" />
            <Switch size="sm" isSelected={theme === "dark"} onValueChange={(v) => setTheme(v ? "dark" : "light")} />
            <Icon icon="mdi:weather-night" className="text-slate-400" />
          </div>
          {!user && (
            <div className="px-3 py-2">
              <Button as={Link} href="/dang-nhap" fullWidth variant="bordered" onClick={() => setIsMenuOpen(false)}>
                Đăng nhập
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
