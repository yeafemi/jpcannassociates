import { createRouter } from "@tanstack/react-router";
import { createHashHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { DefaultErrorComponent } from "./components/DefaultErrorComponent";

export const getRouter = () => {
  // Use hash history in production for GitHub Pages compatibility
  const history =
    typeof window !== "undefined" && process.env.NODE_ENV === "production"
      ? createHashHistory()
      : undefined;

  const router = createRouter({
    routeTree,
    history,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
