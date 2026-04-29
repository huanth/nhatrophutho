// User type definitions
export type UserRole = "user" | "landlord" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  createdAt: string;
  roomCount: number;
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  user: "Người tìm trọ",
  landlord: "Chủ nhà trọ",
  admin: "Quản trị viên",
};
