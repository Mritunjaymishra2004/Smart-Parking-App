import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({

  plugins: [react()],

  server: {

    // ==========================================
    // AUTO OPEN BROWSER
    // ==========================================

    open: true,

    // ==========================================
    // PROXY
    // ==========================================

    proxy: {

      "/api": {

        target:
          "http://localhost:8000",

        changeOrigin: true,

        secure: false,
      },

      "/ws": {

        target:
          "ws://localhost:8000",

        ws: true,
      },
    },
  },
});