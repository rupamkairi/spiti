import path from "path";
import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: [
      { find: "@/convex", replacement: path.resolve(__dirname, "./convex") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
});
