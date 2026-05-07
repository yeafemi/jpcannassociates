import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/components/AuthProvider";
import { BrandLoader } from "@/components/BrandLoader";
import { MotionEffects } from "@/components/MotionEffects";
import { useAuth } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { FloatingSocials } from "@/components/FloatingSocials";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppFrame />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppFrame() {
  const { isLoading } = useAuth();
  const [pageReady, setPageReady] = useState(false);
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (typeof window === "undefined") {
      setPageReady(true);
      return;
    }

    let timeoutId = 0;

    const finishLoading = () => {
      timeoutId = window.setTimeout(() => setPageReady(true), 450);
    };

    if (document.readyState === "complete") {
      finishLoading();
    } else {
      window.addEventListener("load", finishLoading, { once: true });
    }

    return () => {
      window.removeEventListener("load", finishLoading);

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const showLoader = isLoading || !pageReady;

  return (
    <>
      {!isAdminPage && <MotionEffects />}
      <BrandLoader active={showLoader} />
      {!isAdminPage && <FloatingSocials />}
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  );
}
