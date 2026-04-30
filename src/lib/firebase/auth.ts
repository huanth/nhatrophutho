// Firebase Authentication Helpers
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "./config";
import type { UserProfile, UserRole } from "@/types/user";

const googleProvider = new GoogleAuthProvider();

// Sign in with email
export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

// Sign up with email
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
  role: Exclude<UserRole, "admin"> = "user"
) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });

  // Create user profile in Firestore
  await createUserProfile(result.user, displayName, role);

  return result.user;
}

// Sign in with Google
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);

  // Check if profile exists, create if not
  const profileRef = doc(db, "users", result.user.uid);
  const profileSnap = await getDoc(profileRef);
  if (!profileSnap.exists()) {
    await createUserProfile(result.user, result.user.displayName || "User", "user");
  }

  return result.user;
}

// Sign out
export async function signOut() {
  await firebaseSignOut(auth);
}

// Create user profile document
async function createUserProfile(
  user: User,
  displayName: string,
  role: Exclude<UserRole, "admin">
) {
  const isFirstAccount = await isFirstUserAccount();
  const assignedRole: UserRole = isFirstAccount ? "admin" : role;

  const profile: Omit<UserProfile, "createdAt"> & { createdAt: ReturnType<typeof serverTimestamp> } = {
    uid: user.uid,
    email: user.email || "",
    displayName,
    phone: "",
    role: assignedRole,
    avatarUrl: user.photoURL || "",
    createdAt: serverTimestamp(),
    roomCount: 0,
  };

  await setDoc(doc(db, "users", user.uid), profile);
}

async function isFirstUserAccount() {
  const usersQuery = query(collection(db, "users"), limit(1));
  const snapshot = await getDocs(usersQuery);
  return snapshot.empty;
}

// Get user profile
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const profileRef = doc(db, "users", uid);
  const profileSnap = await getDoc(profileRef);
  if (profileSnap.exists()) {
    const data = profileSnap.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as UserProfile;
  }
  return null;
}

// Update user profile
export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const profileRef = doc(db, "users", uid);
  await updateDoc(profileRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Auth state listener
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
