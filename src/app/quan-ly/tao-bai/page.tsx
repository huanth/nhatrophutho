"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, Button, CheckboxGroup, Checkbox, Card } from "@heroui/react";
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

  const wards = useMemo(() => {
    const d = phuThoData.districts.find((d) => d.code === form.district);
    return d?.wards || [];
  }, [form.district]);

  const updateForm = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

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
    if (!form.title || !form.price || !form.district) { setError("Vui lòng điền đầy đủ thông tin bắt buộc"); return; }

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
            <Input label="Tiêu đề bài đăng" placeholder="VD: Phòng trọ giá rẻ gần ĐH Hùng Vương" variant="bordered" value={form.title} onValueChange={(v) => updateForm("title", v)} isRequired />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loại phòng</label>
                <select
                  value={form.roomType || ""}
                  onChange={(e) => updateForm("roomType", e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:border-sky-500 transition-colors"
                >
                  {Object.entries(ROOM_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <Input label="Giá thuê (VNĐ/tháng)" type="number" variant="bordered" value={String(form.price || "")} onValueChange={(v) => updateForm("price", Number(v))} startContent={<span className="text-slate-400 text-sm">₫</span>} isRequired />
              <Input label="Diện tích (m²)" type="number" variant="bordered" value={String(form.area || "")} onValueChange={(v) => updateForm("area", Number(v))} startContent={<Icon icon="mdi:ruler-square" className="text-slate-400" />} isRequired />
            </div>
            <Textarea label="Mô tả chi tiết" placeholder="Mô tả phòng trọ, tiện ích, quy định..." variant="bordered" minRows={4} value={form.description} onValueChange={(v) => updateForm("description", v)} />
          </Card.Content>
        </Card>

        {/* Location */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <Card.Content className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Icon icon="mdi:map-marker" className="text-sky-500" />Vị trí</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Huyện/TP <span className="text-danger">*</span></label>
                <select
                  value={form.district || ""}
                  onChange={(e) => {
                    const code = e.target.value;
                    const d = phuThoData.districts.find((x) => x.code === code);
                    updateForm("district", code);
                    updateForm("districtName", d?.name || "");
                    updateForm("ward", ""); updateForm("wardName", "");
                  }}
                  className="w-full h-10 px-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:border-sky-500 transition-colors"
                  required
                >
                  <option value="">Chọn Huyện/TP</option>
                  {phuThoData.districts.map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Xã/Phường</label>
                <select
                  value={form.ward || ""}
                  onChange={(e) => {
                    const code = e.target.value;
                    const w = wards.find((x) => x.code === code);
                    updateForm("ward", code);
                    updateForm("wardName", w?.name || "");
                  }}
                  disabled={!form.district}
                  className="w-full h-10 px-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:border-sky-500 transition-colors disabled:opacity-50"
                >
                  <option value="">Chọn Xã/Phường</option>
                  {wards.map((w) => <option key={w.code} value={w.code}>{w.name}</option>)}
                </select>
              </div>
            </div>
            <Input label="Địa chỉ cụ thể" placeholder="Số nhà, tên đường, ngõ..." variant="bordered" value={form.address} onValueChange={(v) => updateForm("address", v)} />
          </Card.Content>
        </Card>

        {/* Amenities */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <Card.Content className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Icon icon="mdi:star" className="text-sky-500" />Tiện ích</h2>
            <CheckboxGroup value={form.amenities} onValueChange={(v) => updateForm("amenities", v)} orientation="horizontal" classNames={{ wrapper: "gap-3" }}>
              {AMENITIES.map((a) => (
                <Checkbox key={a.key} value={a.key} classNames={{ label: "text-sm" }}>
                  <span className="flex items-center gap-1"><Icon icon={a.icon} className="text-sky-500" />{a.label}</span>
                </Checkbox>
              ))}
            </CheckboxGroup>
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
            <Input label="Số điện thoại" variant="bordered" value={form.ownerPhone} onValueChange={(v) => updateForm("ownerPhone", v)} startContent={<Icon icon="mdi:phone" className="text-slate-400" />} isRequired />
          </Card.Content>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="flat" onPress={() => router.back()}>Hủy</Button>
          <Button type="submit" color="primary" size="lg" isLoading={loading} className="font-semibold shadow-lg shadow-sky-500/25" startContent={!loading && <Icon icon="mdi:send" />}>
            Đăng bài
          </Button>
        </div>
      </form>
    </div>
  );
}

