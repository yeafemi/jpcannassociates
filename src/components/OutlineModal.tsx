import { useState } from "react";
import { z } from "zod";
import { Loader2, Download, FileX, CheckCircle2, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export type OutlineTraining = {
  id: string;
  slug: string;
  title: string;
  outlinePath?: string | null;
  outlineFilename?: string | null;
};

const formSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(200),
  telephone: z
    .string()
    .trim()
    .min(5, "Please enter a valid phone number")
    .max(40)
    .regex(/^[+\d][\d\s().-]{4,}$/, "Please enter a valid phone number"),
  email: z.string().trim().email("Please enter a valid email").max(320),
  organization: z
    .string()
    .trim()
    .min(2, "Please enter your organization")
    .max(200),
});

type FormValues = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  full_name: "",
  telephone: "",
  email: "",
  organization: "",
};

export function OutlineModal({
  open,
  onOpenChange,
  training,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  training: OutlineTraining | null;
}) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!training) return null;

  const hasOutline = Boolean(training.outlinePath);

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setSuccess(false);
    setSubmitting(false);
  };

  const handleClose = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleField =
    (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      // 1. Save lead
      const { error: insertError } = await supabase
        .from("training_outline_leads")
        .insert({
          training_id: training.id,
          training_slug: training.slug,
          training_title: training.title,
          full_name: parsed.data.full_name,
          telephone: parsed.data.telephone,
          email: parsed.data.email,
          organization: parsed.data.organization,
          user_agent:
            typeof navigator !== "undefined"
              ? navigator.userAgent.slice(0, 500)
              : null,
        });
      if (insertError) throw insertError;

      // 2. Generate signed URL for the outline (60s TTL, force download)
      if (!training.outlinePath) throw new Error("No outline available");
      const { data: signed, error: signErr } = await supabase.storage
        .from("training-outlines")
        .createSignedUrl(training.outlinePath, 60);
      if (signErr || !signed?.signedUrl)
        throw signErr ?? new Error("Could not prepare download");

      // 3. Trigger download
      setSuccess(true);
      toast.success("Thank you! Opening your outline...");
      const a = document.createElement("a");
      a.href = signed.signedUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => handleClose(false), 2200);
    } catch (err) {
      console.error("Outline submission failed", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
        {!hasOutline ? (
          <div className="py-2 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
              <FileX size={26} />
            </div>
            <DialogHeader className="mt-4">
              <DialogTitle className="font-serif text-xl">
                Outline not available yet
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-relaxed">
                Oops! Looks like there's no outline available now. Kindly call{" "}
                <span className="font-semibold text-foreground">
                  0501335818
                </span>{" "}
                or{" "}
                <a
                  href="https://wa.me/233501335818"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  click here
                </a>{" "}
                to request for the outline.
              </DialogDescription>
            </DialogHeader>
            <Button className="mt-6 w-full" onClick={() => handleClose(false)}>
              Close
            </Button>
          </div>
        ) : success ? (
          <div className="py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 size={28} />
            </div>
            <DialogHeader className="mt-4">
              <DialogTitle className="font-serif text-xl">
                Thank you! Opening your outline now.
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm">
                If the outline didn't open automatically, please check your
                popup blocker settings or try again.
              </DialogDescription>
            </DialogHeader>
          </div>
        ) : (
          <>
            <DialogHeader>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {training.title}
              </p>
              <DialogTitle className="font-serif text-xl">
                Get the training outline
              </DialogTitle>
              <DialogDescription className="text-sm">
                Tell us a little about you and we'll start your download
                immediately.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-2 space-y-4" noValidate>
              <Field
                id="ol-name"
                label="Full name"
                value={values.full_name}
                onChange={handleField("full_name")}
                error={errors.full_name}
                autoComplete="name"
                required
              />
              <Field
                id="ol-tel"
                type="tel"
                label="Telephone number"
                value={values.telephone}
                onChange={handleField("telephone")}
                error={errors.telephone}
                autoComplete="tel"
                placeholder="+233 ..."
                required
              />
              <Field
                id="ol-email"
                type="email"
                label="Email address"
                value={values.email}
                onChange={handleField("email")}
                error={errors.email}
                autoComplete="email"
                required
              />
              <Field
                id="ol-org"
                label="Organization"
                value={values.organization}
                onChange={handleField("organization")}
                error={errors.organization}
                autoComplete="organization"
                required
              />

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Preparing
                    your outline…
                  </>
                ) : (
                  <>
                    <FileText size={16} /> View Outline
                  </>
                )}
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                We'll only use your details to share relevant programmes. No
                spam.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  label,
  error,
  required,
  ...rest
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wide"
      >
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
