import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "editor";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  role: UserRole | null;
  isAdmin: boolean;
  isEditor: boolean;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function getUserRole(userId: string): Promise<UserRole | null> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return null;
  }

  // If user has multiple roles, prioritize 'admin'
  const roles = data.map((r: any) => r.role as UserRole);
  if (roles.includes("admin")) return "admin";
  if (roles.includes("editor")) return "editor";
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const syncSession = async (nextSession?: Session | null) => {
      const currentSession =
        nextSession ?? (await supabase.auth.getSession()).data.session;
      const currentUser = currentSession?.user ?? null;
      const currentRole = currentUser ? await getUserRole(currentUser.id) : null;

      if (!active) {
        return;
      }

      setSession(currentSession ?? null);
      setUser(currentUser);
      setRole(currentRole);
      setIsLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncSession(nextSession);
    });

    void syncSession();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      role,
      isAdmin: role === "admin",
      isEditor: role === "editor",
      isLoading,
      refreshSession: async () => {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        const currentUser = data.session?.user ?? null;
        const currentRole = currentUser
          ? await getUserRole(currentUser.id)
          : null;
        setSession(data.session ?? null);
        setUser(currentUser);
        setRole(currentRole);
        setIsLoading(false);
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [role, isLoading, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
