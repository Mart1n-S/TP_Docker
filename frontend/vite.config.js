import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    publicDir: "public",
    host: true,
    port: parseInt(process.env.VITE_PORT) || 5173,
  },
});
