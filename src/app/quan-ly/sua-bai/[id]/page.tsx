"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Card, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getRoomById, updateRoom } from "@/lib/firebase/firestore";
import { uploadRoomImages } from "@/lib/firebase/storage";
import { ROOM_TYPE_LABELS, AMENITIES, type RoomFormData, type Room } from "@/types/room";
import phuThoData from "@/data/phu-tho-locations.json";

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;
  const { user, profile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [form, setForm] = useState<Partial<RoomFormData>>({
    title: "", description: "", price: 0, area: 0, address: "",
    district: "", districtName: "", ward: "", wardName: "",
    roomType: "phong_tro", amenities: [], ownerPhone: "", images: [],
  });

  const wards = phuThoData.wards;

  useEffect(() => {
    if (!roomId || !user) return;
    
    async function loadRoom() {
      try {
        const roomData = await getRoomById(roomId);
        if (!roomData) {
          setError("Không tìm thấy bài đăng");
          return;
        }
        
        // Kiểm tra quyền sở hữu
        if (roomData.ownerId !== user?.uid) {
          setError("Bạn không có quyền chỉnh sửa bài đăng này");
          return;
        }

        setForm({
          title: roomData.title,
          description: roomData.description,
          price: roomData.price,
          area: roomData.area,
          address: roomData.address,
          district: roomData.district,
          districtName: roomData.districtName,
          ward: roomData.ward,
          wardName: roomData.wardName,
          roomType: roomData.roomType,
          amenities: roomData.amenities || [],
          ownerPhone: roomData.ownerPhone,
          images: roomData.images || [],
        });
        setExistingImages(roomData.images || []);
      } catch (err) {
        console.error(err);
        setError("Lỗi khi tải dữ liệu bài đăng");
      } finally {
        setLoading(false);
      }
    }
    
    loadRoom();
  }, [roomId, user]);

  const updateForm = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));
  const inputClassName = "form-control";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length + existingImages.length > 10) { 
      setError("Tối đa 10 ảnh"); 
      return; 
    }
    setImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeExistingImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    if (!form.title || !form.price || !form.wardName) { 
      setError("Vui lòng điền đầy đủ thông tin bắt buộc"); 
      return; 
    }

    setError("");
    setSaving(true);
    try {
      let finalImages = [...existingImages];
      
      // Upload ảnh mới nếu có
      if (imageFiles.length > 0) {
        const newUrls = await uploadRoomImages(imageFiles, roomId);
        finalImages = [...finalImages, ...newUrls];
      }

      await updateRoom(roomId, {
        ...form,
        images: finalImages,
        status: "pending", // Đưa về trạng thái chờ duyệt sau khi sửa
      } as Partial<Room>);

      router.push("/quan-ly");
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi cập nhật bài đăng");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner size="lg" />
        <p className="mt-4 text-slate-500">Đang tải dữ liệu bài đăng...</p>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" isIconOnly onPress={() => router.back()}>
          <Icon icon="mdi:arrow-left" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chỉnh sửa bài đăng</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm flex items-center gap-2">
          <Icon icon="mdi:alert-circle" className="text-xl" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <Card.Content className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Icon icon="mdi:information" className="text-sky-500" />Thông tin cơ bản
            </h2>
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
                  {Object.entries(ROOM_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
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

        {/* Vị trí */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <Card.Content className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Icon icon="mdi:map-marker" className="text-sky-500" />Vị trí
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Khu vực <span className="text-danger">*</span>
                </label>
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

        {/* Tiện ích */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <Card.Content className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Icon icon="mdi:star" className="text-sky-500" />Tiện ích
            </h2>
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

        {/* Hình ảnh */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <Card.Content className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Icon icon="mdi:image-multiple" className="text-sky-500" />Hình ảnh (tối đa 10)
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {/* Ảnh hiện có */}
              {existingImages.map((src, idx) => (
                <div key={`existing-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon icon="mdi:close" className="text-xs" />
                  </button>
                </div>
              ))}
              {/* Ảnh mới thêm */}
              {imagePreviews.map((src, idx) => (
                <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-sky-200 dark:border-sky-800 group">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-sky-500 text-white text-[8px] px-1 rounded">MỚI</div>
                  <button type="button" onClick={() => removeNewImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon icon="mdi:close" className="text-xs" />
                  </button>
                </div>
              ))}
              {existingImages.length + imagePreviews.length < 10 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 transition-colors">
                  <Icon icon="mdi:camera-plus" className="text-2xl text-slate-400" />
                  <span className="text-xs text-slate-400 mt-1">Thêm ảnh</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Liên hệ */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <Card.Content className="p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Icon icon="mdi:phone" className="text-sky-500" />Liên hệ
            </h2>
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
          <Button type="submit" size="lg" isPending={saving} className="font-semibold shadow-lg shadow-sky-500/25">
            {!saving && <Icon icon="mdi:content-save" />}
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
}
