import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // أو اسم الصفحة الرئيسية
import NotFound from "./pages/NotFound"; // صفحة 404


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/qi/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
