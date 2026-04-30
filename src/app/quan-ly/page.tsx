"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Button, Card, Chip, Table, Skeleton
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getRoomsByOwner, deleteRoom } from "@/lib/firebase/firestore";
import { ROOM_STATUS_LABELS, ROOM_TYPE_LABELS, type Room, type RoomStatus } from "@/types/room";
import { formatPrice, formatDate } from "@/lib/utils";

const statusColorMap: Record<RoomStatus, "warning" | "success" | "danger" | "default"> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
  hidden: "default",
};

export default function MyRoomsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const data = await getRoomsByOwner(user!.uid);
        setRooms(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn chắc chắn muốn xóa bài đăng này?")) return;
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bài đăng của tôi</h1>
          <p className="text-sm text-slate-500 mt-1">{rooms.length} bài đăng</p>
        </div>
        <Button onPress={() => router.push("/quan-ly/tao-bai")} className="font-semibold shadow-lg shadow-sky-500/25">
          <Icon icon="mdi:plus" />
          Đăng phòng mới
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
      ) : (rooms.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Icon icon="mdi:file-document-outline" className="text-5xl text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-1">Chưa có bài đăng</h3>
          <p className="text-sm text-slate-500 mb-4">Bắt đầu đăng phòng trọ để tiếp cận người thuê</p>
          <Button onPress={() => router.push("/quan-ly/tao-bai")}>
            <Icon icon="mdi:plus" />
            Đăng phòng đầu tiên
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">PHÒNG TRỌ</th>
                  <th className="px-4 py-3">GIÁ</th>
                  <th className="px-4 py-3">TRẠNG THÁI</th>
                  <th className="px-4 py-3">NGÀY ĐĂNG</th>
                  <th className="px-4 py-3">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{room.title}</p>
                        <p className="text-xs text-slate-500">{room.districtName} • {ROOM_TYPE_LABELS[room.roomType]}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="price-tag text-sm">{formatPrice(room.price)}</span></td>
                    <td className="px-4 py-3">
                      <Chip size="sm" variant="secondary" color={statusColorMap[room.status]}>{ROOM_STATUS_LABELS[room.status]}</Chip>
                    </td>
                    <td className="px-4 py-3"><span className="text-sm text-slate-500">{formatDate(room.createdAt)}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link href={`/tim-phong/${room.slug}`}>
                          <Button size="sm" variant="ghost" isIconOnly title="Xem bài đăng"><Icon icon="mdi:eye" /></Button>
                        </Link>
                        <Link href={`/quan-ly/sua-bai/${room.id}`}>
                          <Button size="sm" variant="ghost" isIconOnly title="Chỉnh sửa"><Icon icon="mdi:pencil" /></Button>
                        </Link>
                        <Button size="sm" variant="danger-soft" isIconOnly onPress={() => handleDelete(room.id)} title="Xóa bài"><Icon icon="mdi:delete" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
