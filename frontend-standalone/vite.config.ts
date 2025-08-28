import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
      "@shared": resolve(import.meta.dirname, "shared"),
      "@assets": resolve(import.meta.dirname, "attached_assets")
    },
  },
  envPrefix: ["VITE_"],
  server: {
    port: 3000,
    open: true
  },
});