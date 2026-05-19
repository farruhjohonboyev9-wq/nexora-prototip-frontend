import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/",

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },
    dedupe: ["react", "react-dom"]
  },

  build: {
    outDir: "dist",
    emptyOutDir: true
  },

  server: {
    host: true,
    port: 5173
  }
});
