import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    port: 8080,
    strictPort: true,
    host: true,
    watch: {
      usePolling: false,
      interval: 1000,
      ignored: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
    },
    cors: true,
    hmr: {
      overlay: false,
      clientPort: 8080,
    },
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
