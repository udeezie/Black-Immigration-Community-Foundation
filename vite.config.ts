import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("react")) {
            return "react-vendor";
          }

          if (id.includes("framer-motion") || id.includes("lenis")) {
            return "animation";
          }
        },
      },
    },
  },
});
