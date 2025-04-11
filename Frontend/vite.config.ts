import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/doctors": {
        target: "http://localhost:3000", // URL backend
        changeOrigin: true, // Đảm bảo header Host khớp với target
        rewrite: (path) => path.replace(/^\/doctors/, "/doctors"), // Giữ nguyên /doctors trong yêu cầu
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));