import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { DefaultErrorComponent } from "./components/DefaultErrorComponent";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    basepath: import.meta.env.BASE_URL,
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
