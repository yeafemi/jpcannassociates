import { ErrorComponentProps } from "@tanstack/react-router";

export function DefaultErrorComponent({ error }: ErrorComponentProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-destructive mb-4">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground mb-4">
          An unexpected error occurred.
        </p>
        <pre className="p-4 bg-muted text-muted-foreground rounded text-sm overflow-auto max-h-40">
          {error.message}
        </pre>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 w-full inline-flex justify-center items-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
