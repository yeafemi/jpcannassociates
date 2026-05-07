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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 font-sans">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" 
          alt="Modern Architecture"
          className="h-full w-full object-cover opacity-50 scale-105 animate-in fade-in zoom-in duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-primary/30" />
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />

      <div className="relative z-10 w-full max-w-5xl px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Brand & Welcome */}
        <section className="hidden lg:flex flex-col justify-center space-y-8 animate-in slide-in-from-left-12 duration-1000">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <ShieldCheck size={32} className="text-accent" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">JPCann Admin</h2>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl font-serif font-bold text-white leading-[1.1]">
              Elevating <span className="text-accent">Excellence</span> through Digital Control.
            </h1>
            <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
              Welcome to the secure administrative portal. Manage your global presence, 
              content, and professional services with a single, unified interface.
            </p>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Admin" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-400">
              Joined by <span className="text-white font-bold">12+</span> team members
            </p>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="flex items-center justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="w-full max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden float-gentle">
            {/* Form Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[60px]" />
            
            <div className="relative mb-10">
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-accent/20 text-accent mb-6">
                <LockKeyhole size={24} />
              </div>
              <h3 className="text-3xl font-serif font-bold text-white">Secure Login</h3>
              <p className="text-slate-400 mt-2">Enter your credentials to continue.</p>
            </div>

            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-slate-300 font-medium">Username</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          autoComplete="username"
                          placeholder={usernamePlaceholder}
                          className="h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-accent/50 transition-all px-5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-slate-300 font-medium">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-accent/50 transition-all px-5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-accent hover:bg-accent/90 text-white font-bold rounded-2xl text-lg shadow-xl shadow-accent/20 transition-all hover:shadow-accent/40 hover:-translate-y-1 active:scale-[0.98]" 
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : "Access Dashboard"}
                </Button>
              </form>
            </Form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                JPCann Associates Limited &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
