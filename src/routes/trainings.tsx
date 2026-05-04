import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/trainings")({
  component: () => <Outlet />,
});
