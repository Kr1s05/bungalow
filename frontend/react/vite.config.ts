import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { config } from "node-config-ts";
import svgr from "vite-plugin-svgr";
export default defineConfig({
  server: {
    port: config.appUrl,
  },
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
