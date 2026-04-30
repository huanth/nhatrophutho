"use client";

import { useEffect, useState } from "react";
import { Card, Button, Chip, Avatar, Skeleton } from "@heroui/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { USER_ROLE_LABELS, type UserProfile, type UserRole } from "@/types/user";

const roleColors: Record<UserRole, "primary" | "success" | "warning"> = {
  user: "primary",
  landlord: "success",
  admin: "warning",
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "users"));
        setUsers(snap.docs.map((d) => d.data() as UserProfile));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Quản lý người dùng</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
        <div className="p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">NGƯỜI DÙNG</th>
                  <th className="px-4 py-3">EMAIL</th>
                  <th className="px-4 py-3">VAI TRÒ</th>
                  <th className="px-4 py-3">SĐT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {users.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          name={u.displayName?.charAt(0)} 
                          size="sm" 
                          src={u.avatarUrl || undefined} 
                          showFallback
                        />
                        <span className="font-medium text-sm">{u.displayName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-sm text-slate-500">{u.email}</span></td>
                    <td className="px-4 py-3">
                      <Chip size="sm" variant="secondary" color={roleColors[u.role]}>{USER_ROLE_LABELS[u.role]}</Chip>
                    </td>
                    <td className="px-4 py-3"><span className="text-sm text-slate-500">{u.phone || "—"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
