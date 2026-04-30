"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { type User } from "firebase/auth";
import { getUserProfile, onAuthChange, signOut } from "@/lib/firebase/auth";
import type { UserProfile } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isLandlord: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  isLandlord: false,
  isAdmin: false,
  refreshProfile: async () => {},
});

const PROFILE_RETRY_DELAYS = [0, 300, 700];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getUserProfileWithRetry(uid: string) {
  for (const delay of PROFILE_RETRY_DELAYS) {
    if (delay > 0) {
      await wait(delay);
    }

    const profile = await getUserProfile(uid);
    if (profile) {
      return profile;
    }
  }

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const p = await getUserProfileWithRetry(user.uid);
      if (p) {
        setProfile(p);
        return;
      }

      await signOut();
      setUser(null);
      setProfile(null);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setLoading(true);

      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        await firebaseUser.reload();
        const p = await getUserProfileWithRetry(firebaseUser.uid);

        if (!p) {
          await signOut();
          setUser(null);
          setProfile(null);
          return;
        }

        setUser(firebaseUser);
        setProfile(p);
      } catch {
        await signOut();
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextValue = {
    user,
    profile,
    loading,
    isLandlord: profile?.role === "landlord" || profile?.role === "admin",
    isAdmin: profile?.role === "admin",
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default useAuth;
