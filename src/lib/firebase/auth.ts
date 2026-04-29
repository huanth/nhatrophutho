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
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import type { UserProfile } from "@/types/user";

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
  role: "user" | "landlord" = "user"
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
  role: "user" | "landlord"
) {
  const profile: Omit<UserProfile, "createdAt"> & { createdAt: ReturnType<typeof serverTimestamp> } = {
    uid: user.uid,
    email: user.email || "",
    displayName,
    phone: "",
    role,
    avatarUrl: user.photoURL || "",
    createdAt: serverTimestamp(),
    roomCount: 0,
  };

  await setDoc(doc(db, "users", user.uid), profile);
}

// Get user profile
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const profileRef = doc(db, "users", uid);
  const profileSnap = await getDoc(profileRef);
  if (profileSnap.exists()) {
    return profileSnap.data() as UserProfile;
  }
  return null;
}

// Auth state listener
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
