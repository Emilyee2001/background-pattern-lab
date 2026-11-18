import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // 相對路徑：部署在 GitHub Pages 的子路徑（/<repo>/）也能載入資源，不受 repo 名稱影響
  base: './',
  plugins: [react(), tailwindcss()],
})
