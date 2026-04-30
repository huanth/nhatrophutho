"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/lib/hooks/useAuth";
import { createRoom } from "@/lib/firebase/firestore";
import { uploadRoomImages } from "@/lib/firebase/storage";
import { ROOM_TYPE_LABELS, AMENITIES, type RoomType, type RoomFormData } from "@/types/room";
import phuThoData from "@/data/phu-tho-locations.json";
import Navbar from "@/components/ui/Navbar";

export default function CreateRoomPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [form, setForm] = useState<Partial<RoomFormData>>({
    title: "", description: "", price: 0, area: 0, address: "",
    district: "", districtName: "", ward: "", wardName: "",
    roomType: "phong_tro", amenities: [], ownerPhone: profile?.phone || "", images: [],
  });

  const wards = phuThoData.wards;

  const updateForm = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));
  const inputClassName = "form-control";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 10) { setError("Tối đa 10 ảnh"); return; }
    setImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    if (!form.title || !form.price || !form.wardName) { setError("Vui lòng điền đầy đủ thông tin bắt buộc"); return; }

    setError("");
    setLoading(true);
    try {
      const roomId = await createRoom(form as RoomFormData, user.uid, profile.displayName);

      if (imageFiles.length > 0) {
        const urls = await uploadRoomImages(imageFiles, roomId);
        const { updateRoom } = await import("@/lib/firebase/firestore");
        await updateRoom(roomId, { images: urls });
      }

      router.push("/quan-ly");
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi đăng bài");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Đăng phòng trọ mới</h1>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm flex items-center gap-2">
          <Icon icon="mdi:alert-circle" />{error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <Card.Content className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Icon icon="mdi:information" className="text-sky-500" />Thông tin cơ bản</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tiêu đề bài đăng <span className="text-danger">*</span>
              </label>
              <input
                className={inputClassName}
                placeholder="VD: Phòng trọ giá rẻ gần ĐH Hùng Vương"
                value={form.title || ""}
                onChange={(event) => updateForm("title", event.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loại phòng</label>
                <select
                  value={form.roomType || ""}
                  onChange={(e) => updateForm("roomType", e.target.value)}
                  className={inputClassName}
                >
                  {Object.entries(ROOM_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Giá thuê (VNĐ/tháng) <span className="text-danger">*</span>
                </label>
                <input
                  className={inputClassName}
                  type="number"
                  value={String(form.price || "")}
                  onChange={(event) => updateForm("price", Number(event.target.value))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Diện tích (m²) <span className="text-danger">*</span>
                </label>
                <input
                  className={inputClassName}
                  type="number"
                  value={String(form.area || "")}
                  onChange={(event) => updateForm("area", Number(event.target.value))}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Mô tả chi tiết
              </label>
              <textarea
                className={inputClassName}
                placeholder="Mô tả phòng trọ, tiện ích, quy định..."
                rows={4}
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
              />
            </div>
          </Card.Content>
        </Card>

        {/* Location */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <Card.Content className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Icon icon="mdi:map-marker" className="text-sky-500" />Vị trí</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Khu vực <span className="text-danger">*</span></label>
                <select
                  value={form.wardName || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    updateForm("ward", name);
                    updateForm("wardName", name);
                  }}
                  className={inputClassName}
                  required
                >
                  <option value="">Chọn Khu vực</option>
                  {wards.map((w) => <option key={w.name} value={w.name}>{w.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Địa chỉ cụ thể
              </label>
              <input
                className={inputClassName}
                placeholder="Số nhà, tên đường, ngõ..."
                value={form.address || ""}
                onChange={(event) => updateForm("address", event.target.value)}
              />
            </div>
          </Card.Content>
        </Card>

        {/* Amenities */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <Card.Content className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Icon icon="mdi:star" className="text-sky-500" />Tiện ích</h2>
            <div className="flex flex-wrap gap-2 pt-2">
              {AMENITIES.map((a) => {
                const isSelected = form.amenities?.includes(a.key);
                return (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => {
                      const current = form.amenities || [];
                      const next = isSelected 
                        ? current.filter(k => k !== a.key)
                        : [...current, a.key];
                      updateForm("amenities", next);
                    }}
                    className={`px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium flex items-center gap-2 select-none ${
                      isSelected 
                        ? "border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400" 
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600"
                    }`}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </Card.Content>
        </Card>

        {/* Images */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <Card.Content className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Icon icon="mdi:image-multiple" className="text-sky-500" />Hình ảnh (tối đa 10)</h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon icon="mdi:close" className="text-xs" />
                  </button>
                </div>
              ))}
              {imagePreviews.length < 10 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 transition-colors">
                  <Icon icon="mdi:camera-plus" className="text-2xl text-slate-400" />
                  <span className="text-xs text-slate-400 mt-1">Thêm ảnh</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Contact */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <Card.Content className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Icon icon="mdi:phone" className="text-sky-500" />Liên hệ</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Số điện thoại <span className="text-danger">*</span>
              </label>
              <input
                className={inputClassName}
                value={form.ownerPhone || ""}
                onChange={(event) => updateForm("ownerPhone", event.target.value)}
                required
              />
            </div>
          </Card.Content>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onPress={() => router.back()}>Hủy</Button>
          <Button type="submit" size="lg" isPending={loading} className="font-semibold shadow-lg shadow-sky-500/25">
            {!loading && <Icon icon="mdi:send" />}
            Đăng bài
          </Button>
        </div>
      </form>
    </div>
  );
}

