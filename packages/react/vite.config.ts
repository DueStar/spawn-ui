import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    rollupOptions: { external: [/^react($|\/)/, /^react-dom($|\/)/, /^@base-ui\/react/, /^@phosphor-icons\/react/, /^@spawn-ui\/tokens/] },
    cssCodeSplit: false, emptyOutDir: true, sourcemap: true,
  },
})
