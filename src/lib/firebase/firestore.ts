// Firestore CRUD helpers for rooms
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./config";
import type { Room, RoomFilters, RoomFormData } from "@/types/room";
import type { AppNotification } from "@/types/notification";
import { generateSlug } from "../utils";

const ROOMS_COLLECTION = "rooms";
const NOTIFICATIONS_COLLECTION = "notifications";
const PAGE_SIZE = 12;

function isIndexBuildingError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const maybeError = error as { code?: string; message?: string };
  return (
    maybeError.code === "failed-precondition" &&
    typeof maybeError.message === "string" &&
    maybeError.message.includes("requires an index")
  );
}

function mapRoom(doc: QueryDocumentSnapshot<DocumentData>): Room {
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Room;
}

function sortNewestFirst(rooms: Room[]): Room[] {
  return [...rooms].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function mapNotification(doc: QueryDocumentSnapshot<DocumentData>): AppNotification {
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as AppNotification;
}

import phuThoData from "@/data/phu-tho-locations.json";

// Get approved rooms with filters
export async function getRooms(
  filters?: RoomFilters,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ rooms: Room[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> {
  const roomsRef = collection(db, ROOMS_COLLECTION);
  const constraints: ReturnType<typeof where>[] = [
    where("status", "==", "approved"),
  ];

  // Apply filters
  if (filters?.district) {
    constraints.push(where("district", "==", filters.district));
  }
  if (filters?.ward) {
    const matchedWard = phuThoData.wards.find(w => w.name === filters.ward);
    
    if (matchedWard && matchedWard.mergedFrom && matchedWard.mergedFrom.length > 0) {
      const searchNames = [matchedWard.name, ...matchedWard.mergedFrom];
      constraints.push(where("wardName", "in", searchNames.slice(0, 10)));
    } else {
      constraints.push(where("ward", "==", filters.ward));
    }
  }
  if (filters?.roomType) {
    constraints.push(where("roomType", "==", filters.roomType));
  }
  if (filters?.minPrice) {
    constraints.push(where("price", ">=", filters.minPrice));
  }
  if (filters?.maxPrice) {
    constraints.push(where("price", "<=", filters.maxPrice));
  }

  // Build query
  let q = query(
    roomsRef,
    ...constraints,
    orderBy("createdAt", "desc"),
    limit(PAGE_SIZE)
  );

  if (lastDoc) {
    q = query(
      roomsRef,
      ...constraints,
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(PAGE_SIZE)
    );
  }

  try {
    const snapshot = await getDocs(q);
    const rooms = snapshot.docs.map(mapRoom);
    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return { rooms, lastVisible };
  } catch (error) {
    if (!isIndexBuildingError(error)) {
      throw error;
    }

    const fallbackSnapshot = await getDocs(query(roomsRef, ...constraints));
    const rooms = sortNewestFirst(fallbackSnapshot.docs.map(mapRoom)).slice(0, PAGE_SIZE);

    return { rooms, lastVisible: null };
  }
}

// Get single room by slug
export async function getRoomBySlug(slug: string): Promise<Room | null> {
  const roomsRef = collection(db, ROOMS_COLLECTION);
  const q = query(
    roomsRef,
    where("slug", "==", slug),
    where("status", "==", "approved"),
    limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Room;
}

// Get rooms by owner
export async function getRoomsByOwner(ownerId: string): Promise<Room[]> {
  const roomsRef = collection(db, ROOMS_COLLECTION);
  const q = query(roomsRef, where("ownerId", "==", ownerId), orderBy("createdAt", "desc"));

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapRoom);
  } catch (error) {
    if (!isIndexBuildingError(error)) {
      throw error;
    }

    const fallbackSnapshot = await getDocs(query(roomsRef, where("ownerId", "==", ownerId)));
    return sortNewestFirst(fallbackSnapshot.docs.map(mapRoom));
  }
}

// Get pending rooms (admin)
export async function getPendingRooms(): Promise<Room[]> {
  const roomsRef = collection(db, ROOMS_COLLECTION);
  const q = query(
    roomsRef,
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapRoom);
  } catch (error) {
    if (!isIndexBuildingError(error)) {
      throw error;
    }

    const fallbackSnapshot = await getDocs(query(roomsRef, where("status", "==", "pending")));
    return sortNewestFirst(fallbackSnapshot.docs.map(mapRoom));
  }
}

// Create room
export async function createRoom(data: RoomFormData, ownerId: string, ownerName: string): Promise<string> {
  const slug = generateSlug(data.title);
  const roomData = {
    ...data,
    slug,
    status: "pending",
    ownerId,
    ownerName,
    viewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, ROOMS_COLLECTION), roomData);

  // Notify all admins about the new pending room
  try {
    const usersRef = collection(db, "users");
    const adminQuery = query(usersRef, where("role", "==", "admin"));
    const adminSnapshot = await getDocs(adminQuery);

    const notificationPromises = adminSnapshot.docs.map((adminDoc) =>
      addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
        userId: adminDoc.id,
        type: "new_room_pending",
        title: "Bài đăng mới chờ duyệt",
        message: `"${data.title}" bởi ${ownerName} đang chờ duyệt.`,
        link: "/admin/duyet-bai",
        read: false,
        createdAt: serverTimestamp(),
      })
    );
    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Error creating admin notifications:", error);
  }

  return docRef.id;
}

// Update room
export async function updateRoom(roomId: string, data: Partial<Room>): Promise<void> {
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);
  await updateDoc(roomRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Approve/reject room (admin)
export async function setRoomStatus(
  roomId: string,
  status: "approved" | "rejected"
): Promise<void> {
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);
  const roomSnap = await getDoc(roomRef);

  await updateDoc(roomRef, { status, updatedAt: serverTimestamp() });

  if (!roomSnap.exists()) return;

  const room = { id: roomSnap.id, ...roomSnap.data() } as Room;
  try {
    await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
      userId: room.ownerId,
      type: status === "approved" ? "room_approved" : "room_rejected",
      title: status === "approved" ? "Bài đăng đã được duyệt" : "Bài đăng bị từ chối",
      message:
        status === "approved"
          ? `Bài "${room.title}" đã được duyệt và đang hiển thị công khai.`
          : `Bài "${room.title}" đã bị từ chối. Vui lòng kiểm tra và chỉnh sửa lại thông tin.`,
      link: status === "approved" ? `/tim-phong/${room.slug}` : "/quan-ly",
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating room status notification:", error);
  }
}

// Delete room
export async function deleteRoom(roomId: string): Promise<void> {
  await deleteDoc(doc(db, ROOMS_COLLECTION, roomId));
}

// Increment view count
export async function incrementViewCount(roomId: string): Promise<void> {
  try {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    const roomSnap = await getDoc(roomRef);
    if (roomSnap.exists()) {
      const currentViews = roomSnap.data().viewCount || 0;
      await updateDoc(roomRef, { viewCount: currentViews + 1 });
    }
  } catch {
    // View counts are non-critical and should not block room details.
  }
}

// Get featured rooms (latest approved)
export async function getFeaturedRooms(count: number = 6): Promise<Room[]> {
  const roomsRef = collection(db, ROOMS_COLLECTION);
  const q = query(
    roomsRef,
    where("status", "==", "approved"),
    orderBy("createdAt", "desc"),
    limit(count)
  );

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapRoom);
  } catch (error) {
    if (!isIndexBuildingError(error)) {
      throw error;
    }

    const fallbackSnapshot = await getDocs(query(roomsRef, where("status", "==", "approved")));
    return sortNewestFirst(fallbackSnapshot.docs.map(mapRoom)).slice(0, count);
  }
}

export function listenUserNotifications(
  userId: string,
  callback: (notifications: AppNotification[]) => void
) {
  const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION);
  const q = query(notificationsRef, where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs
      .map(mapNotification)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    callback(notifications);
  });
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await updateDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId), { read: true });
}

export async function markNotificationsRead(notificationIds: string[]): Promise<void> {
  await Promise.all(notificationIds.map((id) => markNotificationRead(id)));
}
