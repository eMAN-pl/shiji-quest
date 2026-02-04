import { defineConfig } from 'vite'

export default defineConfig({
  base: '/shiji-quest/',
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
