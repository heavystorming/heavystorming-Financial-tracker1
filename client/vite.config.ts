import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [
        require("tailwindcss")({
          content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
          ],
        }),
        require("autoprefixer"),
      ],
    },
  },
});