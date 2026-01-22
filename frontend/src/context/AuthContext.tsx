"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Hardcoded user ID
  const HARDCODED_USER_ID = "80517dd5-ad8a-49dc-9f81-2c8f6741cb5f";

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchHardcodedUser = async () => {
      try {
        // Mock Session and User objects
        const mockUser = {
          id: HARDCODED_USER_ID,
          aud: "authenticated",
          role: "authenticated",
          email: "hardcoded@example.com",
          email_confirmed_at: new Date().toISOString(),
          phone: "",
          confirmation_sent_at: "",
          confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          app_metadata: { provider: "email", providers: ["email"] },
          user_metadata: {},
          identities: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as User;

        const mockSession = {
          access_token: "mock-access-token",
          token_type: "bearer",
          expires_in: 3600,
          refresh_token: "mock-refresh-token",
          user: mockUser,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
        } as Session;

        setSession(mockSession);
        setUser(mockUser);

        // Fetch user profile from 'users' table
        const { data: profileData, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", HARDCODED_USER_ID)
          .single();

        if (profileData) {
          setProfile(profileData);
        } else if (error) {
          console.error("Error fetching hardcoded profile:", error);
        }

        setLoading(false);

        // Optional: Redirect away from login if needed, but since we are always "authed",
        // we might want to just let the user navigate freely or push them to dashboard if they hit login.
        if (
          ["/login", "/signup", "/register", "/complete-profile"].includes(
            pathname,
          )
        ) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Hardcoded auth setup failed", err);
        setLoading(false);
      }
    };

    fetchHardcodedUser();
  }, [mounted, pathname, router]);

  const signOut = async () => {
    // No-op or reload to reset
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
};
