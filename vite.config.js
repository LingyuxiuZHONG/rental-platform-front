import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:10010',
        changeOrigin: true,
        secure: false
      },
      '/ws': {
        target: 'http://localhost:10010',
        ws: true, // 开启 WebSocket 代理
        changeOrigin: true,
        secure: false
      }
    }
  },  
  define: {
    'global': 'window',  // 在 Vite 配置中为浏览器环境定义 global
  }
});
