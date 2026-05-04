import { useMemo, useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL_DOMAIN = "jpcann-admin.local";

const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be 32 characters or fewer")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Use letters, numbers, dots, dashes or underscores only",
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/admin",
  }),
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (role) {
        throw redirect({ to: "/admin" });
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Admin Login — JPCann Associates" },
      {
        name: "description",
        content: "Secure admin access for JPCann website editors.",
      },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { refreshSession } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const usernamePlaceholder = useMemo(() => "jpcannadmin", []);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);

    const normalizedUsername = values.username.trim().toLowerCase();
    const adminEmail = `${normalizedUsername}@${ADMIN_EMAIL_DOMAIN}`;

    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: values.password,
    });

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    await refreshSession();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: role, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user?.id ?? "")
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !role) {
      await supabase.auth.signOut();
      await refreshSession();
      toast.error("Your account does not have admin access.");
      setSubmitting(false);
      return;
    }

    toast.success("Welcome back.");
    await navigate({ to: search.redirect || "/admin" });
    setSubmitting(false);
  });

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="mx-auto grid min-h-screen max-w-6xl items-stretch px-4 py-8 md:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <section
          className="relative hidden overflow-hidden rounded-xl border border-border text-primary-foreground lg:block"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_25%_20%,white,transparent_40%),radial-gradient(circle_at_80%_80%,var(--accent),transparent_50%)]" />
          <div className="relative flex h-full flex-col justify-between p-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-primary-foreground/20 bg-primary-foreground/10">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Admin workspace
              </p>
              <h1 className="mt-4 font-serif text-4xl">
                Control the entire website without technical complexity.
              </h1>
              <p className="mt-5 max-w-md text-sm text-primary-foreground/80">
                Update page copy, services, careers, events, contact details and
                visuals from one guided dashboard.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
            <div className="mb-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">
                <LockKeyhole size={22} />
              </div>
              <h1 className="mt-5 font-serif text-3xl text-foreground">
                Admin login
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in with your approved admin username and password to access
                the content editor.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          autoComplete="username"
                          placeholder={usernamePlaceholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Signing in..." : "Sign in to admin"}
                </Button>
              </form>
            </Form>
          </div>
        </section>
      </div>
    </div>
  );
}
