"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button, Chip, Divider, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { getRoomBySlug, incrementViewCount } from "@/lib/firebase/firestore";
import { ROOM_TYPE_LABELS, AMENITIES, type Room } from "@/types/room";
import { formatPrice, formatArea, formatDate } from "@/lib/utils";

export default function RoomDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRoomBySlug(slug);
        setRoom(data);
        if (data) await incrementViewCount(data.id);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen"><Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div className="h-8 w-64 skeleton rounded" />
          <div className="aspect-[2/1] skeleton rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col"><Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon icon="mdi:home-off" className="text-6xl text-slate-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Không tìm thấy phòng trọ</h1>
            <Button as={Link} href="/tim-phong" color="primary">Quay lại</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const roomAmenities = AMENITIES.filter((a) => room.amenities?.includes(a.key));

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-sky-600">Trang chủ</Link>
            <Icon icon="mdi:chevron-right" className="text-xs" />
            <Link href="/tim-phong" className="hover:text-sky-600">Tìm phòng</Link>
            <Icon icon="mdi:chevron-right" className="text-xs" />
            <span className="text-slate-800 dark:text-slate-200 truncate max-w-xs">{room.title}</span>
          </nav>

          {/* Image Gallery */}
          <div className="relative aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3">
            {room.images?.[activeImage] ? (
              <Image src={room.images[activeImage]} alt={room.title} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon icon="mdi:image-off" className="text-6xl text-slate-400" />
              </div>
            )}
          </div>
          {room.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
              {room.images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${activeImage === idx ? "border-sky-500" : "border-transparent"}`}>
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Chip size="sm" variant="flat" color="primary" className="mb-2">{ROOM_TYPE_LABELS[room.roomType]}</Chip>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{room.title}</h1>
                <p className="price-tag text-2xl">{formatPrice(room.price)}</p>
              </div>

              <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:ruler-square" className="text-sky-600" />
                  <span className="text-sm"><strong>{formatArea(room.area)}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:map-marker" className="text-emerald-600" />
                  <span className="text-sm">{room.wardName}, {room.districtName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:eye" className="text-amber-600" />
                  <span className="text-sm">{room.viewCount} lượt xem</span>
                </div>
              </div>

              <Divider />
              <div>
                <h2 className="text-lg font-semibold mb-2">📍 Địa chỉ</h2>
                <p className="text-slate-600 dark:text-slate-400">{room.address}, {room.wardName}, {room.districtName}, Phú Thọ</p>
              </div>

              <Divider />
              <div>
                <h2 className="text-lg font-semibold mb-2">📝 Mô tả</h2>
                <div className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">{room.description}</div>
              </div>

              {roomAmenities.length > 0 && (
                <>
                  <Divider />
                  <div>
                    <h2 className="text-lg font-semibold mb-3">⭐ Tiện ích</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {roomAmenities.map((a) => (
                        <div key={a.key} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <Icon icon={a.icon} className="text-sky-500" />
                          <span className="text-sm font-medium">{a.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Contact sidebar */}
            <div>
              <div className="sticky top-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-lg">
                <h3 className="font-semibold mb-4">Liên hệ chủ trọ</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={room.ownerName?.charAt(0)} size="md" color="primary" />
                  <div>
                    <p className="font-semibold">{room.ownerName}</p>
                    <p className="text-xs text-slate-500">Chủ nhà trọ</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button fullWidth color="primary" size="lg" startContent={<Icon icon="mdi:phone" />} as="a" href={`tel:${room.ownerPhone}`}>
                    {room.ownerPhone || "Gọi điện"}
                  </Button>
                  <Button fullWidth variant="flat" color="success" size="lg" startContent={<Icon icon="simple-icons:zalo" />} as="a" href={`https://zalo.me/${room.ownerPhone}`} target="_blank">
                    Nhắn Zalo
                  </Button>
                </div>
                <Divider className="my-4" />
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex justify-between"><span>Ngày đăng</span><span className="font-medium text-slate-700 dark:text-slate-300">{formatDate(room.createdAt)}</span></div>
                  <div className="flex justify-between"><span>Mã tin</span><span className="font-medium text-slate-700 dark:text-slate-300">{room.id.slice(0, 8)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
