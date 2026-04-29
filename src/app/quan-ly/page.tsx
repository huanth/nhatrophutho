"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
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
        <Button as={Link} href="/quan-ly/tao-bai" color="primary" startContent={<Icon icon="mdi:plus" />} className="font-semibold shadow-lg shadow-sky-500/25">
          Đăng phòng mới
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Icon icon="mdi:file-document-outline" className="text-5xl text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-1">Chưa có bài đăng</h3>
          <p className="text-sm text-slate-500 mb-4">Bắt đầu đăng phòng trọ để tiếp cận người thuê</p>
          <Button as={Link} href="/quan-ly/tao-bai" color="primary" startContent={<Icon icon="mdi:plus" />}>Đăng phòng đầu tiên</Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <Table aria-label="Danh sách bài đăng" removeWrapper>
            <TableHeader>
              <TableColumn>PHÒNG TRỌ</TableColumn>
              <TableColumn>GIÁ</TableColumn>
              <TableColumn>TRẠNG THÁI</TableColumn>
              <TableColumn>NGÀY ĐĂNG</TableColumn>
              <TableColumn>THAO TÁC</TableColumn>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{room.title}</p>
                      <p className="text-xs text-slate-500">{room.districtName} • {ROOM_TYPE_LABELS[room.roomType]}</p>
                    </div>
                  </TableCell>
                  <TableCell><span className="price-tag text-sm">{formatPrice(room.price)}</span></TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color={statusColorMap[room.status]}>{ROOM_STATUS_LABELS[room.status]}</Chip>
                  </TableCell>
                  <TableCell><span className="text-sm text-slate-500">{formatDate(room.createdAt)}</span></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {room.status === "approved" && (
                        <Button as={Link} href={`/tim-phong/${room.slug}`} size="sm" variant="light" isIconOnly><Icon icon="mdi:eye" /></Button>
                      )}
                      <Button size="sm" variant="light" color="danger" isIconOnly onPress={() => handleDelete(room.id)}><Icon icon="mdi:delete" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
