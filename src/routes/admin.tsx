import {
  createFileRoute,
  Link,
  redirect,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import {
  LogOut,
  Shield,
  GraduationCap,
  Users2,
  Upload,
  Trash2,
  FileCheck2,
  FileX2,
  Plus,
  Pencil,
  Search,
  Loader2,
  Mail,
  Phone,
  Building2,
  Calendar,
  Download,
  ChevronDown,
  LayoutDashboard,
  MapPin,
  Briefcase,
  ShieldCheck,
  ShieldOff,
  FileText,
  UserRound,
  Users,
  MessageSquare,
  Layout,
  Settings,
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Globe,
  History,
  RefreshCcw,
  UserPlus,
  Moon,
  Sun,
  SwatchBook,
  Minimize2,
  Activity,
  BookOpen,
} from "lucide-react";
import { SitePageEditor } from "@/components/admin/SitePageEditor";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { logAudit } from "@/utils/audit";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    // Skip guard for the login child route to avoid redirect loops
    if (location.pathname.startsWith("/admin/login")) {
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({
        to: "/admin/login",
        search: { redirect: location.href },
      });
    }
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .in("role", ["admin", "editor"])
      .maybeSingle();

    if (!userRole) {
      throw redirect({
        to: "/admin/login",
        search: { redirect: location.href },
      });
    }
  },
  head: () => ({
    meta: [
      { title: "Admin Editor — JPCann Associates" },
      {
        name: "description",
        content:
          "Manage trainings, outlines and leads for the JPCann marketing site.",
      },
    ],
  }),
  component: AdminPage,
});

const THEMATIC_AREAS = [
  "Board, Executive & Senior Management",
  "Sustainability, Climate Risks & ESG",
  "Leadership & Managerial Skills",
  "Human Resource Management",
  "Banking & Financial Services",
  "Artificial Intelligence (AI), Data Analysis & Digital Marketing",
  "Information, Communication & Technology",
  "Accounting & Finance",
  "Governance, Risk & Compliance (GRC)",
  "Health, Safety & Environment",
  "General",
  "Public Sector Management",
  "Certified & Professional",
  "Certified Courses - SIMS",
  "In-House",
];

type Training = {
  id: string;
  item_key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  metadata: Record<string, unknown> & {
    thematic_area?: string;
    venue?: string;
    dates?: string[];
    register_url?: string;
    outline_path?: string;
    outline_filename?: string;
  };
  sort_order: number;
  is_published: boolean;
};

type Lead = {
  id: string;
  training_title: string;
  training_slug: string | null;
  full_name: string;
  telephone: string;
  email: string;
  organization: string;
  created_at: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function AdminPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  if (location.pathname.startsWith("/admin/login")) {
    return <Outlet />;
  }

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      color: "text-blue-500",
    },
    {
      id: "content",
      label: "Page Editor",
      icon: Layout,
      color: "text-indigo-500",
    },
    {
      id: "trainings",
      label: "Trainings",
      icon: GraduationCap,
      color: "text-emerald-500",
    },
    { id: "ebooks", label: "E-books", icon: BookOpen, color: "text-amber-600" },
    { id: "blog", label: "Blog", icon: FileText, color: "text-rose-500" },
    {
      id: "clients",
      label: "Client Logos",
      icon: ImageIcon,
      color: "text-blue-600",
    },
    {
      id: "accreditations",
      label: "Accreditations",
      icon: Shield,
      color: "text-indigo-600",
    },
    {
      id: "stats",
      label: "Site Stats",
      icon: LayoutDashboard,
      color: "text-teal-600",
    },
    { id: "offices", label: "Offices", icon: MapPin, color: "text-orange-500" },
    {
      id: "portfolios",
      label: "Portfolios",
      icon: Briefcase,
      color: "text-amber-500",
    },
    {
      id: "management",
      label: "Management",
      icon: Users,
      color: "text-purple-500",
    },
    { id: "staff", label: "Staff", icon: UserRound, color: "text-pink-500" },
    {
      id: "facilitators",
      label: "Facilitators",
      icon: UserRound,
      color: "text-teal-500",
    },
    {
      id: "testimonials",
      label: "Testimonials",
      icon: MessageSquare,
      color: "text-pink-500",
    },
    { id: "leads", label: "Leads", icon: UserPlus, color: "text-blue-500" },
    {
      id: "enquiries",
      label: "Enquiries",
      icon: MessageSquare,
      color: "text-cyan-500",
    },
    { id: "users", label: "Users", icon: Shield, color: "text-slate-500" },
    { id: "audit", label: "Audit Log", icon: History, color: "text-gray-500" },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      color: "text-gray-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Modern Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card shadow-sm transition-all md:relative">
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center border-b border-border px-6">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
                <Shield size={18} />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                JPCann Admin
              </span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  activeTab === item.id
                    ? "bg-primary/5 text-primary shadow-sm ring-1 ring-primary/10"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon
                  size={18}
                  className={
                    activeTab === item.id ? "text-primary" : item.color
                  }
                />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="border-t border-border p-4">
            <div className="mb-4 rounded-xl bg-muted p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground">
                    {user?.email?.split("@")[0]}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-border text-muted-foreground hover:bg-muted hover:text-destructive"
              onClick={async () => {
                await signOut();
                toast.success("Signed out.");
                navigate({ to: "/admin/login", search: { redirect: "/admin" } });
              }}
            >
              <LogOut size={16} />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-card/80 px-8 backdrop-blur-md">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              Dashboard / {menuItems.find((m) => m.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground transition-all hover:bg-muted hover:shadow-sm"
            >
              <Globe size={14} className="text-primary" />
              Visit Website
            </Link>
          </div>
        </header>

        <div className="p-8">
          <div className="mx-auto max-w-6xl">
            {activeTab === "overview" && (
              <Reveal variant="up">
                <OverviewAdmin setActiveTab={setActiveTab} />
              </Reveal>
            )}
            {activeTab === "trainings" && (
              <Reveal variant="up">
                <TrainingsAdmin />
              </Reveal>
            )}
            {activeTab === "ebooks" && (
              <Reveal variant="up">
                <EbooksAdmin />
              </Reveal>
            )}
            {activeTab === "blog" && (
              <Reveal variant="up">
                <BlogAdmin />
              </Reveal>
            )}
            {activeTab === "clients" && (
              <Reveal variant="up">
                <CollectionEditor
                  collectionKey="clientele"
                  labelSingular="client logo"
                  labelPlural="Client Logos"
                  titleLabel="Company Name"
                />
              </Reveal>
            )}
            {activeTab === "accreditations" && (
              <Reveal variant="up">
                <CollectionEditor
                  collectionKey="accreditations"
                  labelSingular="accreditation"
                  labelPlural="Accreditations"
                  titleLabel="Accreditation Name"
                />
              </Reveal>
            )}
            {activeTab === "stats" && (
              <Reveal variant="up">
                <CollectionEditor
                  collectionKey="homepage_stats"
                  labelSingular="stat"
                  labelPlural="Homepage Stats"
                  titleLabel="Value (e.g. 15+)"
                  subtitleLabel="Label (e.g. Years of practice)"
                  showImage={false}
                />
              </Reveal>
            )}
            {activeTab === "offices" && (
              <Reveal variant="up">
                <CollectionEditor
                  collectionKey="office_locations"
                  labelSingular="office"
                  labelPlural="Offices"
                  titleLabel="City/Region (e.g. Ghana Office)"
                  subtitleLabel="Company Name (e.g. JPCann Associates Ltd)"
                  showImage={false}
                  showDescription={true}
                />
              </Reveal>
            )}
            {activeTab === "portfolios" && (
              <Reveal variant="up">
                <PortfoliosAdmin />
              </Reveal>
            )}
            {activeTab === "management" && (
              <Reveal variant="up">
                <PeopleAdmin
                  collectionKey="management"
                  labelSingular="management profile"
                  labelPlural="Management"
                />
              </Reveal>
            )}
            {activeTab === "staff" && (
              <Reveal variant="up">
                <PeopleAdmin
                  collectionKey="staff"
                  labelSingular="staff member"
                  labelPlural="Staff"
                />
              </Reveal>
            )}
            {activeTab === "facilitators" && (
              <Reveal variant="up">
                <PeopleAdmin
                  collectionKey="facilitators"
                  labelSingular="facilitator"
                  labelPlural="Facilitators"
                />
              </Reveal>
            )}
            {activeTab === "testimonials" && (
              <Reveal variant="up">
                <CollectionEditor
                  collectionKey="testimonials"
                  labelSingular="Testimonial"
                  labelPlural="Testimonials"
                  showImage={false}
                  showSubtitle={true}
                  showDescription={true}
                  subtitleLabel="Client Name"
                  titleLabel="Feedback"
                />
              </Reveal>
            )}

            {activeTab === "leads" && (
              <Reveal variant="up">
                <LeadsAdmin />
              </Reveal>
            )}
            {activeTab === "users" && (
              <Reveal variant="up">
                <UsersAdmin />
              </Reveal>
            )}
            {activeTab === "content" && (
              <Reveal variant="up">
                <PageContentEditor />
              </Reveal>
            )}
            {activeTab === "enquiries" && (
              <Reveal variant="up">
                <ContactEnquiriesAdmin />
              </Reveal>
            )}
            {activeTab === "audit" && (
              <Reveal variant="up">
                <AuditLogAdmin />
              </Reveal>
            )}
            {activeTab === "settings" && (
              <Reveal variant="up">
                <SettingsAdmin />
              </Reveal>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function PageContentEditor() {
  const [activePage, setActivePage] = useState("index");

  const pages = [
    { id: "index", label: "Home Page", icon: Layout },
    { id: "about", label: "About Us", icon: Users },
    { id: "advisory", label: "Advisory", icon: Briefcase },
    { id: "outsourcing", label: "Outsourcing", icon: Users2 },
    { id: "contact", label: "Contact", icon: Phone },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 rounded-2xl bg-card p-2 shadow-sm border border-border">
        {pages.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePage(p.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
              activePage === p.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <p.icon size={16} />
            {p.label}
          </button>
        ))}
      </div>

      <SitePageEditor pageKey={activePage} />
    </div>
  );
}

/* ────────────────────────────  TRAININGS ADMIN  ──────────────────────────── */

function TrainingsAdmin() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Training | "new" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Training | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_collections")
      .select(
        "id,item_key,title,subtitle,description,image_url,metadata,sort_order,is_published",
      )
      .eq("collection_key", "trainings")
      .order("sort_order", { ascending: true });
    if (error) toast.error("Could not load trainings");
    else setItems((data ?? []) as Training[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.metadata?.thematic_area ?? "").toLowerCase().includes(q),
    );
  }, [items, query]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    // Best-effort: also remove the outline file
    if (confirmDelete.metadata?.outline_path) {
      await supabase.storage
        .from("training-outlines")
        .remove([confirmDelete.metadata.outline_path]);
    }
    const { error } = await supabase
      .from("site_collections")
      .delete()
      .eq("id", confirmDelete.id);
    if (error) toast.error("Could not delete training");
    else {
      toast.success("Training deleted");
      logAudit({
        action_type: "DELETE",
        resource_type: "training",
        resource_name: confirmDelete.title,
      });
      setConfirmDelete(null);
      load();
    }
  };

  const downloadTemplate = () => {
    const headers =
      "title,item_key,thematic_area,dates,venue,register_url,image_url,description,is_published";
    const example =
      'Advanced Strategic Management,,Board Executive & Senior Management,"04 – 06 May 2026; 10 - 12 June 2026",Accra Ghana,https://tms.akauntability.net/public-actions/booking-form,,Description here,TRUE';
    const blob = new Blob([`${headers}\n${example}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trainings_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) {
        toast.error("CSV file is empty or missing headers");
        setIsImporting(false);
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const rows = lines.slice(1).map((line) => {
        // Simple CSV parser that handles commas inside quotes
        const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;
        const matches: string[] = [];
        let m;
        while ((m = regex.exec(line)) !== null) {
          matches.push(m[0].replace(/^"|"$/g, "").trim());
        }

        const row: any = {};
        headers.forEach((h, i) => {
          row[h] = matches[i] || "";
        });
        return row;
      });

      const payloads = rows.map((row) => {
        const title = row.title || "Untitled Training";
        const dates = (row.dates || "")
          .split(";")
          .map((d: string) => d.trim())
          .filter(Boolean);
        const metadata = {
          thematic_area: row.thematic_area || THEMATIC_AREAS[0],
          venue: row.venue || "JPCann Associates Ltd. Premises",
          dates,
          register_url:
            row.register_url ||
            "https://tms.akauntability.net/public-actions/booking-form",
        };

        return {
          collection_key: "trainings",
          item_key: row.item_key || slugify(title),
          title,
          subtitle: row.subtitle || (dates[0] ?? null),
          description: row.description || null,
          image_url: row.image_url || null,
          metadata: metadata as any,
          is_published: row.is_published?.toUpperCase() === "TRUE",
        };
      });

      const { error } = await supabase
        .from("site_collections")
        .insert(payloads);
      setIsImporting(false);
      if (error) toast.error("Import failed: " + error.message);
      else {
        toast.success(`Successfully imported ${payloads.length} trainings`);
        load();
      }
    };
    reader.readAsText(file);
    if (importRef.current) importRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative md:max-w-sm md:flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trainings…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            ref={importRef}
            onChange={handleImport}
            accept=".csv"
            className="hidden"
          />
          <Button variant="outline" onClick={downloadTemplate} size="sm">
            <Download size={14} /> Template
          </Button>
          <Button
            variant="outline"
            onClick={() => importRef.current?.click()}
            disabled={isImporting}
            size="sm"
          >
            {isImporting ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Upload size={14} />
            )}
            Import CSV
          </Button>
          <Button onClick={() => setEditing("new")} size="sm">
            <Plus size={14} /> New training
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            <Loader2 className="mr-2 animate-spin" size={16} /> Loading
            trainings…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No trainings yet. Create your first programme.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Training</TableHead>
                <TableHead className="hidden md:table-cell">
                  Thematic area
                </TableHead>
                <TableHead>Outline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{t.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.subtitle}
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {t.metadata?.thematic_area ?? "—"}
                  </TableCell>
                  <TableCell>
                    {t.metadata?.outline_path ? (
                      <Badge className="gap-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                        <FileCheck2 size={12} /> Available
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <FileX2 size={12} /> None
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {t.is_published ? (
                      <Badge variant="outline">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditing(t)}
                      >
                        <Pencil size={14} /> Edit
                      </Button>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setConfirmDelete(t)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {editing && (
        <TrainingEditor
          training={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      <AlertDialog
        open={confirmDelete !== null}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this training?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove "{confirmDelete?.title}" and its
              outline file (if any). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ────────────────────────────  TRAINING EDITOR  ──────────────────────────── */

function TrainingEditor({
  training,
  onClose,
  onSaved,
}: {
  training: Training | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = training === null;
  const [title, setTitle] = useState(training?.title ?? "");
  const [itemKey, setItemKey] = useState(training?.item_key ?? "");
  const [thematic, setThematic] = useState(
    training?.metadata?.thematic_area ?? THEMATIC_AREAS[0],
  );
  const [datesText, setDatesText] = useState(
    Array.isArray(training?.metadata?.dates)
      ? (training!.metadata!.dates as string[]).join("\n")
      : "",
  );
  const [subtitle, setSubtitle] = useState(training?.subtitle ?? "");
  const [venue, setVenue] = useState(
    (training?.metadata?.venue as string) ?? "JPCann Associates Ltd. Premises",
  );
  const [registerUrl, setRegisterUrl] = useState(
    (training?.metadata?.register_url as string) ??
      "https://tms.akauntability.net/public-actions/booking-form",
  );
  const [imageUrl, setImageUrl] = useState(training?.image_url ?? "");
  const [description, setDescription] = useState(training?.description ?? "");
  const [published, setPublished] = useState(training?.is_published ?? true);
  const [outlinePath, setOutlinePath] = useState(
    training?.metadata?.outline_path ?? "",
  );
  const [outlineFilename, setOutlineFilename] = useState(
    training?.metadata?.outline_filename ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    const slugBase = itemKey || slugify(title) || `training-${Date.now()}`;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `trainings/${slugBase}-${Date.now()}.${ext}`;

    setImageUploading(true);
    const { error: upErr } = await supabase.storage
      .from("site-media")
      .upload(path, file, { upsert: false, contentType: file.type });

    if (upErr) {
      setImageUploading(false);
      toast.error("Image upload failed: " + upErr.message);
      return;
    }

    const { data: pub } = supabase.storage
      .from("site-media")
      .getPublicUrl(path);
    setImageUrl(pub.publicUrl);
    setImageUploading(false);
    toast.success("Cover image uploaded. Don't forget to save.");
  };

  // Auto-generate slug for new items
  useEffect(() => {
    if (isNew) setItemKey(slugify(title));
  }, [title, isNew]);

  const handleUpload = async (file: File) => {
    if (!file) return;
    const slugBase = itemKey || slugify(title) || `outline-${Date.now()}`;
    const ext = file.name.split(".").pop() ?? "pdf";
    const path = `${slugBase}/${Date.now()}.${ext}`;

    setUploading(true);
    // Remove the previous file (best-effort) before uploading the new one
    if (outlinePath) {
      await supabase.storage.from("training-outlines").remove([outlinePath]);
    }
    const { error } = await supabase.storage
      .from("training-outlines")
      .upload(path, file, { upsert: false, contentType: file.type });
    setUploading(false);
    if (error) {
      toast.error("Upload failed: " + error.message);
      return;
    }
    setOutlinePath(path);
    setOutlineFilename(file.name);
    toast.success("Outline uploaded. Don't forget to save.");
  };

  const handleRemoveOutline = async () => {
    if (!outlinePath) return;
    await supabase.storage.from("training-outlines").remove([outlinePath]);
    setOutlinePath("");
    setOutlineFilename("");
    toast.success("Outline removed. Save to apply.");
  };

  const handleSave = async () => {
    if (!title.trim() || !itemKey.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);
    const dates = datesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const baseMeta = (training?.metadata as Record<string, unknown>) ?? {};
    const metadata: Record<string, unknown> = {
      ...baseMeta,
      thematic_area: thematic,
      venue,
      dates,
      register_url: registerUrl,
    };
    if (outlinePath) {
      metadata.outline_path = outlinePath;
      metadata.outline_filename = outlineFilename;
    } else {
      delete metadata.outline_path;
      delete metadata.outline_filename;
    }

    const payload = {
      collection_key: "trainings",
      item_key: itemKey,
      title,
      subtitle: subtitle || (dates[0] ?? null),
      description: description || null,
      image_url: imageUrl || null,
      // Supabase generated types expect a Json-shaped value here.
      metadata: metadata as unknown as never,
      is_published: published,
    };

    if (isNew) {
      const { error } = await supabase
        .from("site_collections")
        .insert([payload]);
      if (error) {
        toast.error("Could not create training: " + error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("site_collections")
        .update(payload)
        .eq("id", training!.id);
      if (error) {
        toast.error("Could not update training: " + error.message);
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    toast.success("Training saved");
    onSaved();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {isNew ? "New training" : "Edit training"}
          </DialogTitle>
          <DialogDescription>
            Fill in the programme details and (optionally) upload its outline
            file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field label="Title" required>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Slug (URL)">
              <Input
                value={itemKey}
                onChange={(e) => setItemKey(slugify(e.target.value))}
              />
            </Field>
            <Field label="Thematic area">
              <div className="relative">
                <select
                  value={thematic}
                  onChange={(e) => setThematic(e.target.value)}
                  className="h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {THEMATIC_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </Field>
          </div>

          <Field label="Dates (one per line, e.g. '04 – 06 May 2026')">
            <Textarea
              rows={3}
              value={datesText}
              onChange={(e) => setDatesText(e.target.value)}
              placeholder="04 – 06 May 2026"
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Venue">
              <Input value={venue} onChange={(e) => setVenue(e.target.value)} />
            </Field>
            <Field label="Register URL">
              <Input
                value={registerUrl}
                onChange={(e) => setRegisterUrl(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Cover image URL">
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/…"
                className="flex-1"
              />
              <input
                ref={imageFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageUpload(f);
                  e.target.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => imageFileRef.current?.click()}
                disabled={imageUploading}
                className="shrink-0"
              >
                {imageUploading ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <Upload size={14} />
                )}
                Upload
              </Button>
            </div>
          </Field>

          <Field label="Short description">
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          {/* Outline file */}
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Training outline file
                </p>
                {outlinePath ? (
                  <p className="mt-1 truncate text-sm text-foreground">
                    <FileCheck2
                      size={14}
                      className="mr-1 inline text-emerald-600"
                    />
                    {outlineFilename || outlinePath}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    No outline uploaded yet (visitors will see the "no outline"
                    message).
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                    e.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Upload size={14} />
                  )}
                  {outlinePath ? "Replace" : "Upload"}
                </Button>
                {outlinePath && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={handleRemoveOutline}
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="pub"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="pub" className="text-sm">
              Published (visible on the public site)
            </Label>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="animate-spin" size={14} />}
            Save training
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wide">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

/* ────────────────────────────  LEADS ADMIN  ──────────────────────────── */

function LeadsAdmin() {
  const { isAdmin } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("training_outline_leads")
      .select(
        "id,training_title,training_slug,full_name,telephone,email,organization,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error("Could not load leads");
    else setLeads((data ?? []) as Lead[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.full_name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.organization.toLowerCase().includes(q) ||
        l.training_title.toLowerCase().includes(q),
    );
  }, [leads, query]);

  const exportCsv = () => {
    const header = [
      "Full name",
      "Telephone",
      "Email",
      "Organization",
      "Training",
      "Submitted",
    ];
    const rows = filtered.map((l) => [
      l.full_name,
      l.telephone,
      l.email,
      l.organization,
      l.training_title,
      new Date(l.created_at).toISOString(),
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `outline-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total leads" value={leads.length.toString()} />
        <StatCard
          label="This week"
          value={leads
            .filter(
              (l) =>
                new Date(l.created_at).getTime() >
                Date.now() - 7 * 24 * 60 * 60 * 1000,
            )
            .length.toString()}
        />
        <StatCard
          label="Unique organisations"
          value={new Set(
            leads.map((l) => l.organization.toLowerCase()),
          ).size.toString()}
        />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative md:max-w-sm md:flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, organisation or training…"
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={exportCsv}
          disabled={filtered.length === 0}
        >
          <Download size={16} /> Export CSV
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            <Loader2 className="mr-2 animate-spin" size={16} /> Loading leads…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            {leads.length === 0
              ? "No outline download requests yet."
              : "No leads match your search."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead>Training</TableHead>
                <TableHead className="hidden md:table-cell">
                  Submitted
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">
                      {l.full_name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Building2 size={12} /> {l.organization}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <a
                      href={`mailto:${l.email}`}
                      className="flex items-center gap-1 text-xs text-foreground hover:text-primary"
                    >
                      <Mail size={12} /> {l.email}
                    </a>
                    <a
                      href={`tel:${l.telephone}`}
                      className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    >
                      <Phone size={12} /> {l.telephone}
                    </a>
                  </TableCell>
                  <TableCell className="text-xs text-foreground">
                    {l.training_title}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(l.created_at).toLocaleString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  onClick,
  color = "text-primary",
}: {
  label: string;
  value: string | number;
  icon?: any;
  onClick?: () => void;
  color?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group interactive-lift rounded-xl border border-border bg-card p-6 shadow-sm transition-all",
        onClick && "cursor-pointer hover:border-primary/20 hover:shadow-md",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
          {label}
        </p>
        {Icon && (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 transition-all duration-300",
              color,
              onClick &&
                "group-hover:bg-primary group-hover:text-primary-foreground",
            )}
          >
            <Icon size={16} />
          </div>
        )}
      </div>
      <p className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

/* ────────────────────────────  OVERVIEW  ──────────────────────────── */

function OverviewAdmin({
  setActiveTab,
}: {
  setActiveTab: (tab: string) => void;
}) {
  const [stats, setStats] = useState({
    trainings: 0,
    trainingsPublished: 0,
    portfolios: 0,
    portfoliosPublished: 0,
    leads: 0,
    leadsThisWeek: 0,
    users: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const weekAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const [tAll, tPub, pAll, pPub, lAll, lWeek, uAll, aAll] =
        await Promise.all([
          supabase
            .from("site_collections")
            .select("id", { count: "exact", head: true })
            .eq("collection_key", "trainings"),
          supabase
            .from("site_collections")
            .select("id", { count: "exact", head: true })
            .eq("collection_key", "trainings")
            .eq("is_published", true),
          supabase
            .from("site_collections")
            .select("id", { count: "exact", head: true })
            .eq("collection_key", "portfolio"),
          supabase
            .from("site_collections")
            .select("id", { count: "exact", head: true })
            .eq("collection_key", "portfolio")
            .eq("is_published", true),
          supabase
            .from("training_outline_leads")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("training_outline_leads")
            .select("id", { count: "exact", head: true })
            .gte("created_at", weekAgo),
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("user_roles")
            .select("id", { count: "exact", head: true })
            .eq("role", "admin"),
        ]);
      setStats({
        trainings: tAll.count || 0,
        trainingsPublished: tPub.count || 0,
        portfolios: pAll.count || 0,
        portfoliosPublished: pPub.count || 0,
        leads: lAll.count || 0,
        leadsThisWeek: lWeek.count || 0,
        users: uAll.count || 0,
        admins: aAll.count || 0,
      });
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-10 pb-12">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Trainings"
          value={stats.trainings}
          icon={GraduationCap}
          onClick={() => setActiveTab("trainings")}
          color="text-emerald-500"
        />
        <StatCard
          label="Portfolio Items"
          value={stats.portfolios}
          icon={Briefcase}
          onClick={() => setActiveTab("portfolios")}
          color="text-amber-500"
        />
        <StatCard
          label="Total Leads"
          value={stats.leads}
          icon={Users2}
          onClick={() => setActiveTab("leads")}
          color="text-orange-500"
        />
        <StatCard
          label="Leads This Week"
          value={stats.leadsThisWeek}
          icon={Calendar}
          onClick={() => setActiveTab("leads")}
          color="text-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-1 shadow-sm">
          <div className="border-b border-border p-6">
            <h3 className="font-serif text-xl font-bold">Content Status</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Snapshot of your published items.
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  Trainings ({stats.trainingsPublished} / {stats.trainings})
                </span>
                <span className="text-muted-foreground">
                  {Math.round(
                    (stats.trainingsPublished / (stats.trainings || 1)) * 100,
                  )}
                  %
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{
                    width: `${(stats.trainingsPublished / (stats.trainings || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  Portfolios ({stats.portfoliosPublished} / {stats.portfolios})
                </span>
                <span className="text-muted-foreground">
                  {Math.round(
                    (stats.portfoliosPublished / (stats.portfolios || 1)) * 100,
                  )}
                  %
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-1000"
                  style={{
                    width: `${(stats.portfoliosPublished / (stats.portfolios || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-1 shadow-sm">
          <div className="border-b border-border p-6">
            <h3 className="font-serif text-xl font-bold">Quick Actions</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Frequently used administrative tasks.
            </p>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => setActiveTab("trainings")}
              className="h-24 flex-col gap-2 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 group transition-all"
            >
              <Plus className="text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold group-hover:text-emerald-900 transition-colors">
                New Training
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab("leads")}
              className="h-24 flex-col gap-2 rounded-xl hover:bg-orange-50 hover:border-orange-200 group transition-all"
            >
              <Download className="text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold group-hover:text-orange-900 transition-colors">
                Export Leads
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab("management")}
              className="h-24 flex-col gap-2 rounded-xl hover:bg-purple-50 hover:border-purple-200 group transition-all"
            >
              <UserRound className="text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold group-hover:text-purple-900 transition-colors">
                New Profile
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab("users")}
              className="h-24 flex-col gap-2 rounded-xl hover:bg-blue-50 hover:border-blue-200 group transition-all"
            >
              <Shield className="text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold group-hover:text-blue-900 transition-colors">
                Site Logs
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold">Recent Leads</h3>
          <Link
            to="/admin"
            className="text-xs font-semibold text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("leads");
            }}
          >
            View all
          </Link>
        </div>
        <LeadsAdmin />
      </div>
    </div>
  );
}

/* ────────────────────────────  PORTFOLIOS ADMIN  ──────────────────────────── */

const PORTFOLIO_CATEGORIES = [
  "Business Advisory Services (BAS)",
  "Training & Capacity Building",
  "Business Process Outsourcing",
];

type Portfolio = {
  id: string;
  item_key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  metadata: Record<string, unknown> & {
    category?: string;
    client?: string;
    funder?: string;
    year?: string;
    location?: string;
  };
  sort_order: number;
  is_published: boolean;
};

function PortfoliosAdmin() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Portfolio | "new" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Portfolio | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_collections")
      .select(
        "id,item_key,title,subtitle,description,image_url,metadata,sort_order,is_published",
      )
      .eq("collection_key", "portfolio")
      .order("sort_order", { ascending: true });
    if (error) toast.error("Could not load portfolios");
    else setItems((data ?? []) as Portfolio[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.metadata?.category ?? "").toLowerCase().includes(q) ||
        (p.metadata?.client ?? "").toString().toLowerCase().includes(q),
    );
  }, [items, query]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase
      .from("site_collections")
      .delete()
      .eq("id", confirmDelete.id);
    if (error) toast.error("Could not delete portfolio");
    else {
      toast.success("Portfolio deleted");
      setConfirmDelete(null);
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative md:max-w-sm md:flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search portfolios…"
            className="pl-9"
          />
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus size={16} /> New portfolio
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            <Loader2 className="mr-2 animate-spin" size={16} /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No portfolios match.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{p.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {p.subtitle}
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {p.metadata?.category ?? "—"}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {(p.metadata?.client as string) ?? "—"}
                  </TableCell>
                  <TableCell>
                    {p.is_published ? (
                      <Badge variant="outline">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditing(p)}
                      >
                        <Pencil size={14} /> Edit
                      </Button>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setConfirmDelete(p)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {editing && (
        <PortfolioEditor
          portfolio={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      <AlertDialog
        open={confirmDelete !== null}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this portfolio?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove "{confirmDelete?.title}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PortfolioEditor({
  portfolio,
  onClose,
  onSaved,
}: {
  portfolio: Portfolio | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = portfolio === null;
  const [title, setTitle] = useState(portfolio?.title ?? "");
  const [itemKey, setItemKey] = useState(portfolio?.item_key ?? "");
  const [category, setCategory] = useState(
    (portfolio?.metadata?.category as string) ?? PORTFOLIO_CATEGORIES[0],
  );
  const [subtitle, setSubtitle] = useState(portfolio?.subtitle ?? "");
  const [client, setClient] = useState(
    (portfolio?.metadata?.client as string) ?? "",
  );
  const [funder, setFunder] = useState(
    (portfolio?.metadata?.funder as string) ?? "",
  );
  const [year, setYear] = useState((portfolio?.metadata?.year as string) ?? "");
  const [location, setLocation] = useState(
    (portfolio?.metadata?.location as string) ?? "",
  );
  const [imageUrl, setImageUrl] = useState(portfolio?.image_url ?? "");
  const [description, setDescription] = useState(portfolio?.description ?? "");
  const [published, setPublished] = useState(portfolio?.is_published ?? true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) setItemKey(slugify(title));
  }, [title, isNew]);

  const handleUpload = async (file: File) => {
    if (!file) return;
    const slugBase = itemKey || slugify(title) || `portfolio-${Date.now()}`;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `portfolios/${slugBase}-${Date.now()}.${ext}`;
    setUploading(true);
    const { error: upErr } = await supabase.storage
      .from("site-media")
      .upload(path, file, { upsert: false, contentType: file.type });
    if (upErr) {
      setUploading(false);
      toast.error("Upload failed: " + upErr.message);
      return;
    }
    const { data: pub } = supabase.storage
      .from("site-media")
      .getPublicUrl(path);
    setImageUrl(pub.publicUrl);
    setUploading(false);
    toast.success("Image uploaded");
  };

  const handleSave = async () => {
    if (!title.trim() || !itemKey.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);
    const baseMeta = (portfolio?.metadata as Record<string, unknown>) ?? {};
    const metadata: Record<string, unknown> = {
      ...baseMeta,
      category,
      client: client || undefined,
      funder: funder || undefined,
      year: year || undefined,
      location: location || undefined,
    };

    const insertPayload = {
      collection_key: "portfolio",
      item_key: itemKey,
      title,
      subtitle: subtitle || null,
      description: description || null,
      image_url: imageUrl || null,
      metadata: metadata as unknown as never,
      is_published: published,
    };

    // When updating, never send collection_key / item_key — they are identity
    // fields protected by the unique constraint and must not be overwritten.
    const updatePayload = {
      title,
      subtitle: subtitle || null,
      description: description || null,
      image_url: imageUrl || null,
      metadata: metadata as unknown as never,
      is_published: published,
    };

    const res = isNew
      ? await supabase.from("site_collections").insert([insertPayload])
      : await supabase
          .from("site_collections")
          .update(updatePayload)
          .eq("id", portfolio!.id);
    setSaving(false);
    if (res.error) {
      toast.error("Could not save portfolio: " + res.error.message);
      return;
    }
    toast.success("Portfolio saved");
    logAudit({
      action_type: isNew ? "CREATE" : "UPDATE",
      resource_type: "portfolio",
      resource_name: title,
    });
    onSaved();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {isNew ? "New portfolio" : "Edit portfolio"}
          </DialogTitle>
          <DialogDescription>
            Fill in the project details for this portfolio entry.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field label="Title" required>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label={isNew ? "Slug (URL)" : "Slug (URL) — fixed after creation"}
            >
              <Input
                value={itemKey}
                readOnly={!isNew}
                onChange={(e) => isNew && setItemKey(slugify(e.target.value))}
                className={
                  !isNew ? "opacity-60 cursor-not-allowed bg-muted" : ""
                }
              />
            </Field>
            <Field label="Category">
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {PORTFOLIO_CATEGORIES.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </Field>
          </div>
          <Field label="Subtitle / short tagline">
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Client">
              <Input
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
            </Field>
            <Field label="Funder">
              <Input
                value={funder}
                onChange={(e) => setFunder(e.target.value)}
              />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Year">
              <Input value={year} onChange={(e) => setYear(e.target.value)} />
            </Field>
            <Field label="Location">
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Cover image">
            <div className="space-y-3">
              {imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-7 w-7"
                    onClick={() => setImageUrl("")}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL or upload..."
                  className="flex-1"
                />
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="mr-2 animate-spin" size={14} />
                  ) : (
                    <Upload className="mr-2" size={14} />
                  )}
                  Upload
                </Button>
              </div>
            </div>
          </Field>
          <Field label="Description">
            <Textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <div className="flex items-center gap-2">
            <input
              id="pub-p"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="pub-p" className="text-sm">
              Published (visible on the public site)
            </Label>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="animate-spin" size={14} />}
            Save portfolio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ────────────────────────────  USERS ADMIN  ──────────────────────────── */

type UserRole = "admin" | "editor";

type ProfileRow = {
  user_id: string;
  display_name: string | null;
  created_at: string;
  role: UserRole | null;
};

function UsersAdmin() {
  const { user: currentUser, isAdmin } = useAuth();
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("user_id, display_name, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
    if (pErr || rErr) {
      toast.error("Could not load users");
      setLoading(false);
      return;
    }

    const roleMap = new Map((roles ?? []).map((r) => [r.user_id, r.role]));
    setRows(
      (profiles ?? []).map((p) => ({
        ...p,
        role: (roleMap.get(p.user_id) as UserRole) || null,
      })),
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        (r.display_name ?? "").toLowerCase().includes(q) ||
        r.user_id.toLowerCase().includes(q),
    );
  }, [rows, query]);

  const updateRole = async (userId: string, newRole: UserRole | "member") => {
    if (userId === currentUser?.id && newRole !== "admin") {
      toast.error("You cannot change your own role.");
      return;
    }

    // Remove existing roles first
    const { error: delError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    if (delError) {
      toast.error("Could not update role: " + delError.message);
      return;
    }

    if (newRole !== "member") {
      const { error: insError } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role: newRole }]);

      if (insError) {
        toast.error("Could not set role: " + insError.message);
        return;
      }
    }

    toast.success(`Role updated to ${newRole}`);
    logAudit({
      action_type: "ROLE_CHANGE",
      resource_type: "user",
      resource_name: userId,
      details: { new_role: newRole },
    });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-900 flex justify-between items-center">
        <div>
          <p className="font-bold mb-1">User Management</p>
          <p className="opacity-80">
            Admins can create users and assign roles. Editors can view users but
            cannot change roles.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setIsAddingUser(true)}
            size="sm"
            className="gap-2"
          >
            <Plus size={14} /> Add User
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative md:max-w-sm md:flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            <Loader2 className="mr-2 animate-spin" size={16} /> Loading users…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No users found.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="py-4">User</TableHead>
                <TableHead className="hidden md:table-cell py-4">
                  Joined
                </TableHead>
                <TableHead className="py-4">Current Role</TableHead>
                <TableHead className="text-right py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow
                  key={r.user_id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="py-4">
                    <div className="font-medium text-foreground">
                      {r.display_name ?? "Unnamed user"}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-1 opacity-60">
                      {r.user_id}
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell py-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="opacity-50" />
                      {new Date(r.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {r.role === "admin" ? (
                      <Badge className="gap-1.5 bg-emerald-100/80 text-emerald-800 hover:bg-emerald-100 border-emerald-200">
                        <ShieldCheck size={12} /> Admin
                      </Badge>
                    ) : r.role === "editor" ? (
                      <Badge className="gap-1.5 bg-blue-100/80 text-blue-800 hover:bg-blue-100 border-blue-200">
                        <Pencil size={12} /> Editor
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="gap-1.5 bg-slate-100 text-slate-600 border-slate-200"
                      >
                        Member
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    {isAdmin && r.user_id !== currentUser?.id && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(
                            "h-8 text-[10px] font-bold",
                            r.role === "admin" &&
                              "bg-emerald-50 border-emerald-200 text-emerald-700",
                          )}
                          onClick={() => updateRole(r.user_id, "admin")}
                        >
                          Make Admin
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(
                            "h-8 text-[10px] font-bold",
                            r.role === "editor" &&
                              "bg-blue-50 border-blue-200 text-blue-700",
                          )}
                          onClick={() => updateRole(r.user_id, "editor")}
                        >
                          Make Editor
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(
                            "h-8 text-[10px] font-bold",
                            !r.role && "bg-slate-100 border-slate-200",
                          )}
                          onClick={() => updateRole(r.user_id, "member")}
                        >
                          Revoke
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {isAddingUser && (
        <CreateUserDialog
          onClose={() => setIsAddingUser(false)}
          onCreated={() => {
            setIsAddingUser(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function CreateUserDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<UserRole>("editor");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Create the user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (signUpError) {
      toast.error("Could not create user: " + signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // 2. Grant the role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert([{ user_id: data.user.id, role }]);

      if (roleError) {
        toast.error(
          "User created but role assignment failed: " + roleError.message,
        );
      } else {
        toast.success(`User ${email} created as ${role}`);
        logAudit({
          action_type: "CREATE",
          resource_type: "user",
          resource_name: email,
          details: { role },
        });
        onCreated();
      }
    }

    setLoading(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Dashboard User</DialogTitle>
          <DialogDescription>
            Create an account and assign a role. The user will need to confirm
            their email before logging in.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Display Name</Label>
            <Input
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Initial Password</Label>
            <Input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label>Dashboard Role</Label>
            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                  className="text-primary"
                />
                <span className="text-sm font-medium">Admin</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  checked={role === "editor"}
                  onChange={() => setRole("editor")}
                  className="text-primary"
                />
                <span className="text-sm font-medium">Editor</span>
              </label>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2" size={14} />}
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ────────────────────────────  SITE CONTENT INFO  ──────────────────────────── */

// Replaced by SitePageEditor in the content tab

/* ────────────────────────────  PEOPLE (Staff / Management) ADMIN  ──────────────────────────── */

type Person = {
  id: string;
  item_key: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
};

function PeopleAdmin({
  collectionKey,
  labelSingular,
  labelPlural,
}: {
  collectionKey: "staff" | "management" | "facilitators";
  labelSingular: string;
  labelPlural: string;
}) {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Person | "new" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Person | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_collections")
      .select(
        "id,item_key,title,subtitle,image_url,sort_order,is_published,created_at",
      )
      .eq("collection_key", collectionKey)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) toast.error(`Could not load ${labelPlural.toLowerCase()}`);
    else setItems((data ?? []) as Person[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionKey]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.subtitle ?? "").toLowerCase().includes(q),
    );
  }, [items, query]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase
      .from("site_collections")
      .delete()
      .eq("id", confirmDelete.id);
    if (error) toast.error(`Could not delete ${labelSingular}`);
    else {
      toast.success(
        `${labelSingular[0].toUpperCase() + labelSingular.slice(1)} deleted`,
      );
      logAudit({
        action_type: "DELETE",
        resource_type: collectionKey,
        resource_name: confirmDelete.title,
      });
      setConfirmDelete(null);
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative md:max-w-sm md:flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${labelPlural.toLowerCase()}…`}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus size={16} /> New {labelSingular}
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            <Loader2 className="mr-2 animate-spin" size={16} /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No {labelPlural.toLowerCase()} yet. Click "New {labelSingular}" to
            add one.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Full name</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                        <UserRound size={18} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {p.title}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {p.subtitle ?? "—"}
                  </TableCell>
                  <TableCell>
                    {p.is_published ? (
                      <Badge variant="outline">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditing(p)}
                      >
                        <Pencil size={14} /> Edit
                      </Button>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setConfirmDelete(p)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {editing && (
        <PersonEditor
          collectionKey={collectionKey}
          labelSingular={labelSingular}
          person={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      <AlertDialog
        open={confirmDelete !== null}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {labelSingular}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove "{confirmDelete?.title}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PersonEditor({
  collectionKey,
  labelSingular,
  person,
  onClose,
  onSaved,
}: {
  collectionKey: "staff" | "management" | "facilitators";
  labelSingular: string;
  person: Person | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = person === null;
  const [title, setTitle] = useState(person?.title ?? "");
  const [itemKey, setItemKey] = useState(person?.item_key ?? "");
  const [subtitle, setSubtitle] = useState(person?.subtitle ?? "");
  const [imageUrl, setImageUrl] = useState(person?.image_url ?? "");
  const [sortOrder, setSortOrder] = useState<number>(person?.sort_order ?? 0);
  const [published, setPublished] = useState(person?.is_published ?? true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) setItemKey(slugify(title));
  }, [title, isNew]);

  const handleUpload = async (file: File) => {
    if (!file) return;
    const slugBase = itemKey || slugify(title) || `person-${Date.now()}`;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${collectionKey}/${slugBase}-${Date.now()}.${ext}`;
    setUploading(true);
    const { error: upErr } = await supabase.storage
      .from("site-media")
      .upload(path, file, { upsert: false, contentType: file.type });
    if (upErr) {
      setUploading(false);
      toast.error("Upload failed: " + upErr.message);
      return;
    }
    const { data: pub } = supabase.storage
      .from("site-media")
      .getPublicUrl(path);
    setImageUrl(pub.publicUrl);
    setUploading(false);
    toast.success("Photo uploaded");
  };

  const handleSave = async () => {
    if (!title.trim() || !itemKey.trim()) {
      toast.error("Full name and slug are required");
      return;
    }
    setSaving(true);
    const payload = {
      collection_key: collectionKey,
      item_key: itemKey,
      title,
      subtitle: subtitle || null,
      image_url: imageUrl || null,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
      is_published: published,
      metadata: {},
    };
    const res = isNew
      ? await supabase.from("site_collections").insert([payload])
      : await supabase
          .from("site_collections")
          .update(payload)
          .eq("id", person!.id);
    setSaving(false);
    if (res.error) {
      toast.error(`Could not save ${labelSingular}: ` + res.error.message);
      return;
    }
    toast.success(
      `${labelSingular[0].toUpperCase() + labelSingular.slice(1)} saved`,
    );
    logAudit({
      action_type: isNew ? "CREATE" : "UPDATE",
      resource_type: collectionKey,
      resource_name: title,
    });
    onSaved();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {isNew ? `New ${labelSingular}` : `Edit ${labelSingular}`}
          </DialogTitle>
          <DialogDescription>
            Add a profile photo, name and role.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field label="Full name" required>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Jane Doe"
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Slug (URL key)">
              <Input
                value={itemKey}
                onChange={(e) => setItemKey(slugify(e.target.value))}
              />
            </Field>
            <Field label="Sort order">
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
            </Field>
          </div>
          <Field label="Role / Title" required>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Managing Partner"
            />
          </Field>

          <Field label="Profile photo">
            <div className="space-y-3">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-32 w-32 rounded-md border border-border object-cover"
                />
              )}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Upload size={14} />
                  )}
                  {imageUrl ? "Replace photo" : "Upload photo"}
                </Button>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="…or paste an image URL"
                  className="flex-1 min-w-[200px]"
                />
              </div>
            </div>
          </Field>

          <div className="flex items-center gap-2">
            <input
              id="pub-person"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="pub-person" className="text-sm">
              Published (visible on the public site)
            </Label>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="animate-spin" size={14} />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ────────────────────────────  CONTACT ENQUIRIES ADMIN  ──────────────────────────── */

type Submission = {
  id: string;
  full_name: string;
  email: string;
  organisation: string | null;
  subject: string;
  message: string;
  created_at: string;
};

function ContactEnquiriesAdmin() {
  const { isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error("Could not load enquiries");
    else setSubmissions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const downloadCSV = () => {
    if (submissions.length === 0) return;

    const headers = [
      "Date",
      "Name",
      "Email",
      "Organisation",
      "Subject",
      "Message",
    ];
    const rows = submissions.map((s) => [
      new Date(s.created_at).toLocaleString(),
      s.full_name,
      s.email,
      s.organisation || "",
      s.subject,
      s.message.replace(/"/g, '""'), // Escape quotes for CSV
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `contact_enquiries_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-foreground">
            Contact Enquiries
          </h2>
          <p className="text-sm text-muted-foreground">
            Messages sent via the contact form
          </p>
        </div>
        <Button
          variant="outline"
          onClick={downloadCSV}
          disabled={submissions.length === 0}
          className="gap-2"
        >
          <Download size={14} /> Export CSV
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[180px]">Date</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell
                    colSpan={4}
                    className="h-16 animate-pulse bg-muted/20"
                  />
                </TableRow>
              ))
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-muted-foreground"
                >
                  No enquiries received yet.
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString()} at{" "}
                    {new Date(s.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{s.full_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {s.email}
                      </span>
                      {s.organisation && (
                        <span className="text-[10px] text-accent font-semibold uppercase tracking-wider">
                          {s.organisation}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {s.subject}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                      {s.message}
                    </p>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ────────────────────────────  E-BOOKS ADMIN  ──────────────────────────── */

function EbooksAdmin() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<any | "new" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_collections")
      .select("*")
      .eq("collection_key", "ebooks")
      .order("sort_order", { ascending: true });
    if (error) toast.error("Could not load e-books");
    else setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.subtitle ?? "").toLowerCase().includes(q),
    );
  }, [items, query]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase
      .from("site_collections")
      .delete()
      .eq("id", confirmDelete.id);
    if (error) toast.error("Could not delete e-book");
    else {
      toast.success("E-book deleted");
      logAudit({
        action_type: "DELETE",
        resource_type: "ebook",
        resource_name: confirmDelete.title,
      });
      setConfirmDelete(null);
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative md:max-w-sm md:flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e-books…"
            className="pl-9"
          />
        </div>
        <Button onClick={() => setEditing("new")} size="sm">
          <Plus size={14} /> New e-book
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            <Loader2 className="mr-2 animate-spin" size={16} /> Loading e-books…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No e-books found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>E-book</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.subtitle}
                    </div>
                  </TableCell>
                  <TableCell>
                    {t.is_published ? (
                      <Badge variant="outline">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditing(t)}
                      >
                        <Pencil size={14} />
                      </Button>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setConfirmDelete(t)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {editing && (
        <EbookEditor
          ebook={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      <AlertDialog
        open={confirmDelete !== null}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this e-book?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EbookEditor({
  ebook,
  onClose,
  onSaved,
}: {
  ebook: any | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = ebook === null;
  const [title, setTitle] = useState(ebook?.title ?? "");
  const [itemKey, setItemKey] = useState(ebook?.item_key ?? "");
  const [subtitle, setSubtitle] = useState(ebook?.subtitle ?? "");
  const [description, setDescription] = useState(ebook?.description ?? "");
  const [imageUrl, setImageUrl] = useState(ebook?.image_url ?? "");
  const [published, setPublished] = useState(ebook?.is_published ?? true);
  const [filePath, setFilePath] = useState(ebook?.metadata?.file_path ?? "");
  const [fileFilename, setFileFilename] = useState(
    ebook?.metadata?.file_filename ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) setItemKey(slugify(title));
  }, [title, isNew]);

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    const slugBase = itemKey || slugify(title) || `ebook-${Date.now()}`;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `ebook-covers/${slugBase}-${Date.now()}.${ext}`;
    setImageUploading(true);
    const { error: upErr } = await supabase.storage
      .from("site-media")
      .upload(path, file, { upsert: false, contentType: file.type });
    if (upErr) {
      setImageUploading(false);
      toast.error("Image upload failed: " + upErr.message);
      return;
    }
    const { data: pub } = supabase.storage
      .from("site-media")
      .getPublicUrl(path);
    setImageUrl(pub.publicUrl);
    setImageUploading(false);
    toast.success("Cover image uploaded");
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const path = `ebooks/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("site-media")
      .upload(path, file);
    if (error) toast.error("Upload failed: " + error.message);
    else {
      setFilePath(path);
      setFileFilename(file.name);
      toast.success("File uploaded.");
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      collection_key: "ebooks",
      item_key: itemKey,
      title,
      subtitle,
      description,
      image_url: imageUrl,
      is_published: published,
      metadata: { file_path: filePath, file_filename: fileFilename } as any,
    };
    const { error } = isNew
      ? await supabase.from("site_collections").insert([payload])
      : await supabase
          .from("site_collections")
          .update(payload)
          .eq("id", ebook.id);
    if (error) toast.error("Save failed: " + error.message);
    else {
      toast.success("E-book saved");
      logAudit({
        action_type: isNew ? "CREATE" : "UPDATE",
        resource_type: "ebook",
        resource_name: title,
      });
      onSaved();
    }
    setSaving(false);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isNew ? "New e-book" : "Edit e-book"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Field label="Title" required>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Description">
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <Field label="Cover image">
            <div className="space-y-3">
              {imageUrl && (
                <div className="relative aspect-[3/4] w-32 overflow-hidden rounded-md border border-border mx-auto">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-1 top-1 h-6 w-6"
                    onClick={() => setImageUrl("")}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste cover image URL or upload..."
                  className="flex-1"
                />
                <input
                  ref={imageFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => imageFileRef.current?.click()}
                  disabled={imageUploading}
                >
                  {imageUploading ? (
                    <Loader2 className="mr-2 animate-spin" size={14} />
                  ) : (
                    <Upload className="mr-2" size={14} />
                  )}
                  Upload
                </Button>
              </div>
            </div>
          </Field>
          <div className="rounded-lg border border-dashed p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              E-book PDF file
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm truncate">
                {fileFilename || "No file uploaded"}
              </span>
              <input
                type="file"
                ref={fileRef}
                className="hidden"
                accept=".pdf"
                onChange={(e) =>
                  e.target.files?.[0] && handleFileUpload(e.target.files[0])
                }
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <Upload size={14} />
                )}{" "}
                Upload PDF
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ebook_pub"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <label htmlFor="ebook_pub" className="text-sm font-medium">
              Published
            </label>
          </div>
          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save E-book"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ────────────────────────────  BLOG ADMIN  ──────────────────────────── */

function BlogAdmin() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<any | "new" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_collections")
      .select("*")
      .eq("collection_key", "blog_posts")
      .order("created_at", { ascending: false });
    if (error) toast.error("Could not load blog posts");
    else setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((t) => t.title.toLowerCase().includes(q));
  }, [items, query]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase
      .from("site_collections")
      .delete()
      .eq("id", confirmDelete.id);
    if (error) toast.error("Delete failed");
    else {
      toast.success("Post deleted");
      logAudit({
        action_type: "DELETE",
        resource_type: "blog",
        resource_name: confirmDelete.title,
      });
      setConfirmDelete(null);
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative md:max-w-sm md:flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blog posts…"
            className="pl-9"
          />
        </div>
        <Button onClick={() => setEditing("new")} size="sm">
          <Plus size={14} /> New article
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            <Loader2 className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No posts found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(t.created_at), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    {t.is_published ? (
                      <Badge variant="outline">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditing(t)}
                      >
                        <Pencil size={14} />
                      </Button>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setConfirmDelete(t)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {editing && (
        <BlogEditor
          post={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      <AlertDialog
        open={confirmDelete !== null}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function BlogEditor({
  post,
  onClose,
  onSaved,
}: {
  post: any | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = post === null;
  const [title, setTitle] = useState(post?.title ?? "");
  const [itemKey, setItemKey] = useState(post?.item_key ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [imageUrl, setImageUrl] = useState(post?.image_url ?? "");
  const [content, setContent] = useState(post?.metadata?.content ?? "");
  const [author, setAuthor] = useState(
    post?.metadata?.author ?? "JPCann Editor",
  );
  const [published, setPublished] = useState(post?.is_published ?? true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) setItemKey(slugify(title));
  }, [title, isNew]);

  const handleUpload = async (file: File) => {
    if (!file) return;
    const slugBase = itemKey || slugify(title) || `blog-${Date.now()}`;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `blogs/${slugBase}-${Date.now()}.${ext}`;
    setUploading(true);
    const { error: upErr } = await supabase.storage
      .from("site-media")
      .upload(path, file, { upsert: false, contentType: file.type });
    if (upErr) {
      setUploading(false);
      toast.error("Upload failed: " + upErr.message);
      return;
    }
    const { data: pub } = supabase.storage
      .from("site-media")
      .getPublicUrl(path);
    setImageUrl(pub.publicUrl);
    setUploading(false);
    toast.success("Image uploaded");
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      collection_key: "blog_posts",
      item_key: itemKey,
      title,
      description,
      image_url: imageUrl,
      is_published: published,
      metadata: { content, author } as any,
    };
    const { error } = isNew
      ? await supabase.from("site_collections").insert([payload])
      : await supabase
          .from("site_collections")
          .update(payload)
          .eq("id", post.id);
    if (error) toast.error("Save failed: " + error.message);
    else {
      toast.success("Article saved");
      logAudit({
        action_type: isNew ? "CREATE" : "UPDATE",
        resource_type: "blog",
        resource_name: title,
      });
      onSaved();
    }
    setSaving(false);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "New article" : "Edit article"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Field label="Title" required>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Author">
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </Field>
            <Field label="Slug">
              <Input
                value={itemKey}
                onChange={(e) => setItemKey(slugify(e.target.value))}
              />
            </Field>
          </div>
          <Field label="Cover image">
            <div className="space-y-3">
              {imageUrl && (
                <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border border-border">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-7 w-7"
                    onClick={() => setImageUrl("")}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL or upload..."
                  className="flex-1"
                />
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="mr-2 animate-spin" size={14} />
                  ) : (
                    <Upload className="mr-2" size={14} />
                  )}
                  Upload
                </Button>
              </div>
            </div>
          </Field>
          <Field label="Excerpt/Description">
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <Field label="Content (HTML support)">
            <Textarea
              rows={15}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="font-mono text-sm"
            />
          </Field>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="blog_pub"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <label htmlFor="blog_pub" className="text-sm font-medium">
              Published
            </label>
          </div>
          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Article"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ────────────────────────────  AUDIT LOG ADMIN  ──────────────────────────── */

type AuditLog = {
  id: string;
  user_id: string;
  user_name?: string;
  action_type: string;
  resource_type: string;
  resource_name: string | null;
  details: any;
  created_at: string;
};

function AuditLogAdmin() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("audit_logs_with_users")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) toast.error("Could not load audit logs");
    else setLogs((data ?? []) as AuditLog[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(
      (l) =>
        (l.user_name ?? "").toLowerCase().includes(q) ||
        (l.resource_name ?? "").toLowerCase().includes(q) ||
        l.resource_type.toLowerCase().includes(q) ||
        l.action_type.toLowerCase().includes(q),
    );
  }, [logs, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative md:max-w-sm md:flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logs…"
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCcw
            size={14}
            className={cn("mr-2", loading && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            <Loader2 className="mr-2 animate-spin" size={16} /> Loading logs…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No audit logs found.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="py-4">Time</TableHead>
                <TableHead className="py-4">User</TableHead>
                <TableHead className="py-4">Action</TableHead>
                <TableHead className="py-4">Resource</TableHead>
                <TableHead className="py-4">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow
                  key={l.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="text-xs text-muted-foreground py-4">
                    {format(new Date(l.created_at), "MMM d, HH:mm:ss")}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-medium text-sm">
                      {l.user_name ?? "System"}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      className={cn(
                        "text-[10px] uppercase font-bold",
                        l.action_type === "CREATE" &&
                          "bg-emerald-100 text-emerald-700",
                        l.action_type === "UPDATE" &&
                          "bg-amber-100 text-amber-700",
                        l.action_type === "DELETE" &&
                          "bg-rose-100 text-rose-700",
                        l.action_type === "ROLE_CHANGE" &&
                          "bg-purple-100 text-purple-700",
                        l.action_type === "LOGIN" &&
                          "bg-blue-100 text-blue-700",
                      )}
                    >
                      {l.action_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="text-xs font-semibold text-foreground uppercase tracking-wider opacity-60">
                      {l.resource_type}
                    </div>
                    <div className="text-sm font-medium mt-0.5">
                      {l.resource_name ?? "—"}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground">
                    {JSON.stringify(l.details) !== "{}"
                      ? JSON.stringify(l.details)
                      : "No extra info"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function SettingsAdmin() {
  const {
    theme,
    setTheme,
    reducedMotion,
    setReducedMotion,
    compactMode,
    setCompactMode,
  } = useTheme();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Preferences
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Personalize your dashboard experience.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Appearance Section */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-primary/5 text-primary">
              <SwatchBook size={20} />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Appearance</h3>
              <p className="text-xs text-muted-foreground">
                Select your preferred visual style.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
              { id: "gray", label: "Grey", icon: Monitor },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-300",
                  theme === t.id
                    ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5"
                    : "border-transparent bg-muted hover:bg-muted/80 text-muted-foreground",
                )}
              >
                <t.icon size={24} />
                <span className="text-xs font-bold">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility & Interface */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Interface</h3>
              <p className="text-xs text-muted-foreground">
                Configure accessibility and layout.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Minimize2 size={14} className="text-muted-foreground" />
                  <Label className="text-sm font-bold">Compact Mode</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Reduce padding and spacing.
                </p>
              </div>
              <Switch checked={compactMode} onCheckedChange={setCompactMode} />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-6">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-muted-foreground" />
                  <Label className="text-sm font-bold">Reduced Motion</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimize animations and transitions.
                </p>
              </div>
              <Switch
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-muted/30">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          All settings are saved automatically to this device.
        </p>
      </div>
    </div>
  );
}
