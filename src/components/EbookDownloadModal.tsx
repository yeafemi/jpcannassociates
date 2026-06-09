import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Download, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid telephone number"),
});

type FormValues = z.infer<typeof formSchema>;

interface EbookDownloadModalProps {
  ebook: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EbookDownloadModal({
  ebook,
  open,
  onOpenChange,
}: EbookDownloadModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      // Record the lead in contact_submissions (non-blocking)
      supabase
        .from("contact_submissions")
        .insert({
          full_name: values.fullName,
          email: values.email,
          subject: `E-book Download: ${ebook?.title}`,
          message: `User requested download for e-book: ${ebook?.title} (ID: ${ebook?.id}). Phone: ${values.phone}`,
        })
        .then(({ error }) => {
          if (error) console.warn("Lead capture failed (non-blocking):", error);
        });

      toast.success("Details received! Your download is starting.");
      setDownloadReady(true);

      // Trigger the download if file path exists
      if (ebook?.metadata?.file_path) {
        const { data } = supabase.storage
          .from("site-media")
          .getPublicUrl(ebook.metadata.file_path);

        if (data?.publicUrl) {
          window.open(data.publicUrl, "_blank", "noopener,noreferrer");
        } else {
          toast.error("E-book file not found. Please contact support.");
        }
      } else {
        toast.error("E-book file not found. Please contact support.");
      }

      // Close modal after a delay
      setTimeout(() => {
        onOpenChange(false);
        setDownloadReady(false);
        form.reset();
      }, 3000);
    } catch (error: unknown) {
      toast.error("Something went wrong. Please try again.");
      console.error("Download lead error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Download E-book
          </DialogTitle>
          <DialogDescription>
            Please provide your details to receive the download link for{" "}
            <strong>{ebook?.title}</strong>.
          </DialogDescription>
        </DialogHeader>

        {downloadReady ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Download className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Thank you!
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your download has been triggered. If it doesn't start
              automatically, please contact support.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pt-4"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+233..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing Download...
                  </>
                ) : (
                  "Get My E-book"
                )}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
