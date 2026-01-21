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

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let abortController = new AbortController();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (abortController.signal.aborted || !mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          // Fetch user profile with abort signal
          const { data: profileData } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .abortSignal(abortController.signal)
            .single();

          if (abortController.signal.aborted || !mounted) return;

          if (profileData) {
            setProfile(profileData);
            // Redirect to dashboard if on login/register pages
            if (["/login", "/signup", "/register"].includes(pathname)) {
              router.push("/dashboard");
            }
          } else {
            // No profile found, redirect to complete profile
            if (!pathname.startsWith("/complete-profile")) {
              router.push("/complete-profile");
            }
          }
        } catch (error: any) {
          // Only log errors that aren't abort errors
          if (error.name !== 'AbortError' && mounted) {
            console.error("Profile fetch error:", error);
          }
        }
      } else {
        if (mounted) {
          setProfile(null);
        }
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      abortController.abort();
      subscription.unsubscribe();
    };
  }, [pathname, router, mounted]);

  const signOut = async () => {
    if (!mounted) return;
    try {
      await supabase.auth.signOut();
      if (mounted) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
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
