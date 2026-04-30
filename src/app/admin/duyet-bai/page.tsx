"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Card, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { getPendingRooms, setRoomStatus } from "@/lib/firebase/firestore";
import { ROOM_TYPE_LABELS, type Room } from "@/types/room";
import { formatPrice, formatArea, formatDate } from "@/lib/utils";

export default function ReviewPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try { setRooms(await getPendingRooms()); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleAction = async (roomId: string, status: "approved" | "rejected") => {
    setActionLoading(roomId);
    try {
      await setRoomStatus(roomId, status);
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Duyệt bài đăng</h1>
          <p className="text-sm text-slate-500 mt-1">{rooms.length} bài chờ duyệt</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}</div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Icon icon="mdi:check-all" className="text-5xl text-emerald-400 mx-auto mb-3" />
          <h3 className="font-semibold text-lg">Không có bài chờ duyệt</h3>
          <p className="text-sm text-slate-500 mt-1">Tất cả bài đăng đã được xử lý</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <Card key={room.id} className="border border-slate-200 dark:border-slate-700">
              <Card.Content className="p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-40 h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    {room.images?.[0] ? (
                      <Image src={room.images[0]} alt={room.title} fill className="object-cover" sizes="160px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Icon icon="mdi:image-off" className="text-2xl text-slate-400" /></div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{room.title}</h3>
                      <Chip size="sm" variant="secondary" color="warning">Chờ duyệt</Chip>
                    </div>
                    <p className="price-tag text-lg mb-1">{formatPrice(room.price)}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-2">
                      <span className="flex items-center gap-1"><Icon icon="mdi:ruler-square" className="text-sky-500" />{formatArea(room.area)}</span>
                      <span className="flex items-center gap-1"><Icon icon="mdi:map-marker" className="text-sky-500" />{room.wardName}, {room.districtName}</span>
                      <span className="flex items-center gap-1"><Icon icon="mdi:account" className="text-sky-500" />{room.ownerName}</span>
                      <span>{ROOM_TYPE_LABELS[room.roomType]}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">{room.description}</p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        isPending={actionLoading === room.id}
                        onPress={() => handleAction(room.id, "approved")}
                        className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      >
                        <Icon icon="mdi:check" />
                        Duyệt
                      </Button>
                      <Button
                        size="sm"
                        variant="danger-soft"
                        isPending={actionLoading === room.id}
                        onPress={() => handleAction(room.id, "rejected")}
                      >
                        <Icon icon="mdi:close" />
                        Từ chối
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

