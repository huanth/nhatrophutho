"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
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
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 skeleton rounded-xl" />)}</div>
        ) : (
          <Table aria-label="Users" removeWrapper>
            <TableHeader>
              <TableColumn>NGƯỜI DÙNG</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>VAI TRÒ</TableColumn>
              <TableColumn>SĐT</TableColumn>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.uid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={u.displayName?.charAt(0)} size="sm" src={u.avatarUrl || undefined} />
                      <span className="font-medium text-sm">{u.displayName}</span>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-sm text-slate-500">{u.email}</span></TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color={roleColors[u.role]}>{USER_ROLE_LABELS[u.role]}</Chip>
                  </TableCell>
                  <TableCell><span className="text-sm text-slate-500">{u.phone || "—"}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
