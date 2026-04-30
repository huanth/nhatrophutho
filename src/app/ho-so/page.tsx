"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Card, Avatar, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const roleLabels = {
  admin: { label: "Quản trị viên", color: "danger" as const },
  landlord: { label: "Chủ nhà trọ", color: "success" as const },
  user: { label: "Người tìm trọ", color: "primary" as const },
};

export default function ProfilePage() {
  const { user, profile, loading, isLandlord, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-20 w-20 rounded-full skeleton" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="text-center py-20">
        <Icon icon="mdi:account-off" className="text-6xl text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
        <Button as={Link} href="/dang-nhap">Đăng nhập ngay</Button>
      </div>
    );
  }

  const roleInfo = roleLabels[profile.role as keyof typeof roleLabels] || roleLabels.user;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Hồ sơ cá nhân</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6 border border-slate-200 dark:border-slate-700 text-center">
            <div className="relative mx-auto w-24 h-24 mb-4">
              <Avatar
                src={profile.avatarUrl}
                name={profile.displayName}
                className="w-24 h-24 text-2xl font-bold border-4 border-sky-100 dark:border-sky-900 shadow-xl"
              />
              {isAdmin && (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full border-2 border-white dark:border-slate-800 shadow-md">
                  <Icon icon="mdi:shield-crown" className="text-sm" />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold">{profile.displayName}</h2>
            <p className="text-sm text-slate-500 mb-4">{profile.email}</p>
            <Chip color={roleInfo.color} variant="flat" size="sm" className="mb-2">
              {roleInfo.label}
            </Chip>
          </Card>

          <Card className="p-5 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-sm uppercase text-slate-500 mb-4">Thống kê</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Icon icon="mdi:calendar-account" /> Tham gia
                </span>
                <span className="text-sm font-medium">{formatDate(profile.createdAt)}</span>
              </div>
              {isLandlord && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <Icon icon="mdi:home-city" /> Bài đăng
                  </span>
                  <span className="text-sm font-medium">{profile.roomCount || 0} bài</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-slate-200 dark:border-slate-700">
            <Card.Content className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Icon icon="mdi:account-details" className="text-sky-500" />
                  Thông tin chi tiết
                </h3>
                <Button size="sm" variant="ghost" disabled>
                  <Icon icon="mdi:pencil" />
                  Chỉnh sửa
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase">Họ và tên</p>
                  <p className="text-sm font-medium">{profile.displayName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase">Email</p>
                  <p className="text-sm font-medium">{profile.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase">Số điện thoại</p>
                  <p className="text-sm font-medium">{profile.phone || "Chưa cập nhật"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase">Vai trò hệ thống</p>
                  <p className="text-sm font-medium">{roleInfo.label}</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {isLandlord && (
            <Card className="bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/50 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-sky-500 text-white p-3 rounded-2xl shadow-lg shadow-sky-500/20">
                  <Icon icon="mdi:view-dashboard" className="text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-sky-900 dark:text-sky-100 mb-1">Quản lý bài đăng</h3>
                  <p className="text-sm text-sky-700/70 dark:text-sky-300/70 mb-4">
                    Bạn đang có {profile.roomCount || 0} bài đăng trên hệ thống. Hãy tiếp tục chia sẻ các phòng trọ chất lượng nhé!
                  </p>
                  <Button as={Link} href="/quan-ly" className="font-semibold shadow-md">
                    Đi tới Quản lý
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {isAdmin && (
            <Card className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-500 text-white p-3 rounded-2xl shadow-lg shadow-amber-500/20">
                  <Icon icon="mdi:shield-check" className="text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-1">Quyền Quản trị viên</h3>
                  <p className="text-sm text-amber-700/70 dark:text-amber-300/70 mb-4">
                    Bạn có quyền truy cập vào bảng điều khiển quản trị để duyệt bài đăng và quản lý người dùng.
                  </p>
                  <Button as={Link} href="/admin" variant="secondary" className="font-semibold shadow-md">
                    Bảng điều khiển Admin
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
