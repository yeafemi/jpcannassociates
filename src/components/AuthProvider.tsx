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

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function getAdminStatus(userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error) {
    return false;
  }

  return Boolean(data);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const syncSession = async (nextSession?: Session | null) => {
      const currentSession =
        nextSession ?? (await supabase.auth.getSession()).data.session;
      const currentUser = currentSession?.user ?? null;
      const adminStatus = currentUser
        ? await getAdminStatus(currentUser.id)
        : false;

      if (!active) {
        return;
      }

      setSession(currentSession ?? null);
      setUser(currentUser);
      setIsAdmin(adminStatus);
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
      isAdmin,
      isLoading,
      refreshSession: async () => {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        const currentUser = data.session?.user ?? null;
        const adminStatus = currentUser
          ? await getAdminStatus(currentUser.id)
          : false;
        setSession(data.session ?? null);
        setUser(currentUser);
        setIsAdmin(adminStatus);
        setIsLoading(false);
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [isAdmin, isLoading, session, user],
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
