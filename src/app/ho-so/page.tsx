"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { 
  Card, Avatar, Button, Chip, Modal, 
  ModalHeader, ModalBody, ModalFooter,
  Input, CardContent, ModalContainer, RadioGroup, Radio, Skeleton
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { getRoomsByOwner } from "@/lib/firebase/firestore";
import { updateUserProfile } from "@/lib/firebase/auth";

const roleLabels = {
  admin: { label: "Quản trị viên", color: "danger" as const },
  landlord: { label: "Chủ nhà trọ", color: "success" as const },
  user: { label: "Người tìm trọ", color: "primary" as const },
};

export default function ProfilePage() {
  const { user, profile, loading, isLandlord, isAdmin, refreshProfile } = useAuth();
  const [actualRoomCount, setActualRoomCount] = useState<number | null>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: "",
    phone: "",
    avatarUrl: "",
    role: "" as any,
  });

  // Auto-sync avatar from Google if missing or different
  useEffect(() => {
    async function syncAvatar() {
      if (user?.photoURL && profile && profile.avatarUrl !== user.photoURL) {
        console.log("Syncing avatar from Google...", { google: user.photoURL, profile: profile.avatarUrl });
        await updateUserProfile(user.uid, { avatarUrl: user.photoURL });
        await refreshProfile();
      }
    }
    if (!loading && user && profile) {
      void syncAvatar();
    }
  }, [user, profile, loading, refreshProfile]);

  useEffect(() => {
    if (isLandlord && user) {
      getRoomsByOwner(user.uid).then(rooms => setActualRoomCount(rooms.length));
    }
  }, [isLandlord, user]);

  useEffect(() => {
    if (profile) {
      setEditForm({
        displayName: profile.displayName || "",
        phone: profile.phone || "",
        avatarUrl: profile.avatarUrl || "",
        role: profile.role,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserProfile(user.uid, editForm);
      await refreshProfile();
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex justify-center py-20">
          <Skeleton className="h-24 w-24 rounded-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 text-center py-20">
          <Icon icon="mdi:account-off" className="text-6xl text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
          <Link href="/dang-nhap">
            <Button>Đăng nhập ngay</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const roleInfo = roleLabels[profile.role as keyof typeof roleLabels] || roleLabels.user;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Hồ sơ cá nhân</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar Info */}
            <div className="md:col-span-1 space-y-6">
              <Card className="p-6 border border-slate-200 dark:border-slate-700 text-center">
                <div className="relative mx-auto w-24 h-24 mb-4">
                  <Avatar className="w-24 h-24 text-2xl font-bold border-4 border-sky-100 dark:border-sky-900 shadow-xl">
                    <Avatar.Image src={profile.avatarUrl || undefined} alt={profile.displayName} referrerPolicy="no-referrer" />
                    <Avatar.Fallback>{profile.displayName?.charAt(0)}</Avatar.Fallback>
                  </Avatar>
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
                      <span className="text-sm font-medium">{actualRoomCount !== null ? `${actualRoomCount} bài` : "Đang tải..."}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Main Info */}
            <div className="md:col-span-2 space-y-6">
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Icon icon="mdi:account-details" className="text-sky-500" />
                      Thông tin chi tiết
                    </h3>
                    <Button size="sm" variant="ghost" onPress={onOpen}>
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
                </CardContent>
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
                        Bạn đang có {actualRoomCount !== null ? actualRoomCount : "..."} bài đăng trên hệ thống. Hãy tiếp tục chia sẻ các phòng trọ chất lượng nhé!
                      </p>
                      <Link href="/quan-ly">
                        <Button className="font-semibold shadow-md">
                          Đi tới Quản lý
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )}

              {!isLandlord && (
                <Card className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-500 text-white p-3 rounded-2xl shadow-lg shadow-emerald-500/20">
                      <Icon icon="mdi:home-plus" className="text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-1">Trở thành chủ nhà trọ</h3>
                      <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70 mb-4">
                        Bạn muốn đăng tin cho thuê phòng trọ? Hãy cập nhật vai trò của mình để bắt đầu đăng tin ngay nhé!
                      </p>
                      <Button color="success" onPress={onOpen} className="font-semibold shadow-md text-white">
                        Nâng cấp ngay
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
                      <Link href="/admin">
                        <Button variant="secondary" className="font-semibold shadow-md">
                          Bảng điều khiển Admin
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Profile Modal */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen} placement="center">
        <ModalContainer className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-md w-full mx-auto shadow-2xl">
          <ModalHeader className="flex flex-col gap-1 p-0 mb-4 font-bold text-xl">Chỉnh sửa hồ sơ</ModalHeader>
          <ModalBody className="p-0 mb-6">
            <div className="space-y-4">
              <Input
                label="Họ và tên"
                variant="bordered"
                value={editForm.displayName}
                onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
              />
              <Input
                label="Số điện thoại"
                variant="bordered"
                value={editForm.phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
              />
              <Input
                label="Link ảnh đại diện (URL)"
                variant="bordered"
                value={editForm.avatarUrl}
                placeholder="https://example.com/avatar.jpg"
                onChange={(e) => setEditForm(prev => ({ ...prev, avatarUrl: e.target.value }))}
              />
              
              {!isAdmin && (
                <div className="space-y-2 pt-2">
                  <p className="text-sm font-medium text-slate-500">Vai trò</p>
                  <RadioGroup
                    orientation="horizontal"
                    value={editForm.role}
                    onValueChange={(val) => setEditForm(prev => ({ ...prev, role: val as any }))}
                  >
                    <Radio value="user">Người tìm trọ</Radio>
                    <Radio value="landlord">Chủ nhà trọ</Radio>
                  </RadioGroup>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="p-0 flex justify-end gap-2">
            <Button variant="flat" onPress={onClose}>
              Hủy
            </Button>
            <Button color="primary" onPress={() => handleSave()} isLoading={isSaving}>
              Lưu thay đổi
            </Button>
          </ModalFooter>
        </ModalContainer>
      </Modal>
    </div>
  );
}
