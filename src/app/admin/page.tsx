"use client";

import { useEffect, useState } from "react";
import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface Stats {
  totalRooms: number;
  pendingRooms: number;
  approvedRooms: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalRooms: 0, pendingRooms: 0, approvedRooms: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const roomsSnap = await getDocs(collection(db, "rooms"));
        const pendingSnap = await getDocs(query(collection(db, "rooms"), where("status", "==", "pending")));
        const approvedSnap = await getDocs(query(collection(db, "rooms"), where("status", "==", "approved")));
        const usersSnap = await getDocs(collection(db, "users"));

        setStats({
          totalRooms: roomsSnap.size,
          pendingRooms: pendingSnap.size,
          approvedRooms: approvedSnap.size,
          totalUsers: usersSnap.size,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    loadStats();
  }, []);

  const cards = [
    { label: "Tổng bài đăng", value: stats.totalRooms, icon: "mdi:home-group", color: "from-sky-500 to-sky-600", shadow: "shadow-sky-500/25" },
    { label: "Chờ duyệt", value: stats.pendingRooms, icon: "mdi:clock-outline", color: "from-amber-500 to-amber-600", shadow: "shadow-amber-500/25" },
    { label: "Đã duyệt", value: stats.approvedRooms, icon: "mdi:check-circle", color: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/25" },
    { label: "Người dùng", value: stats.totalUsers, icon: "mdi:account-group", color: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/25" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Tổng quan hệ thống</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="border border-slate-200 dark:border-slate-700">
            <Card.Content className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} ${c.shadow} shadow-lg flex items-center justify-center`}>
                <Icon icon={c.icon} className="text-white text-2xl" />
              </div>
              <div>
                {loading ? <div className="h-7 w-12 skeleton rounded" /> : <p className="text-2xl font-bold text-slate-900 dark:text-white">{c.value}</p>}
                <p className="text-xs text-slate-500">{c.label}</p>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
}

