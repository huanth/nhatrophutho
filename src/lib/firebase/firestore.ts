// Firestore CRUD helpers for rooms
import {
  collection,
  doc,
  getDoc,
  getDocs,
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
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { Room, RoomFilters, RoomFormData } from "@/types/room";
import { generateSlug } from "../utils";

const ROOMS_COLLECTION = "rooms";
const PAGE_SIZE = 12;

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
    constraints.push(where("ward", "==", filters.ward));
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

  const snapshot = await getDocs(q);
  const rooms: Room[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  })) as Room[];

  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

  return { rooms, lastVisible };
}

// Get single room by slug
export async function getRoomBySlug(slug: string): Promise<Room | null> {
  const roomsRef = collection(db, ROOMS_COLLECTION);
  const q = query(roomsRef, where("slug", "==", slug), limit(1));
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
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  })) as Room[];
}

// Get pending rooms (admin)
export async function getPendingRooms(): Promise<Room[]> {
  const roomsRef = collection(db, ROOMS_COLLECTION);
  const q = query(
    roomsRef,
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  })) as Room[];
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
  await updateDoc(roomRef, { status, updatedAt: serverTimestamp() });
}

// Delete room
export async function deleteRoom(roomId: string): Promise<void> {
  await deleteDoc(doc(db, ROOMS_COLLECTION, roomId));
}

// Increment view count
export async function incrementViewCount(roomId: string): Promise<void> {
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);
  const roomSnap = await getDoc(roomRef);
  if (roomSnap.exists()) {
    const currentViews = roomSnap.data().viewCount || 0;
    await updateDoc(roomRef, { viewCount: currentViews + 1 });
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
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  })) as Room[];
}
