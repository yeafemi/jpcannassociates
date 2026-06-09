import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === "true" ? "/jpcannassociates/" : "/",
  plugins: [react(), tailwindcss(), tsconfigPaths(), TanStackRouterVite()],
  build: {
    ssr: false,
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
  },
  server: {
    port: 8080,
    strictPort: true,
    host: true,
  },
});
