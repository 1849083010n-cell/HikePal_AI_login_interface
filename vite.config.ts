import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 允许局域网访问
    port: 5173,
  },
  resolve: {
    alias: {
      // 移除 '@': '/src'，因为您的文件都在根目录下，没有 src 文件夹
      // 如果需要引用根目录，可以直接使用 relative path (./)
      '@': path.resolve(__dirname, './'), 
    },
  },
})