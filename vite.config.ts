import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://btpvwkilgnwvhmmpiuzu.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cHZ3a2lsZ253dmhtbXBpdXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNzY3NDYsImV4cCI6MjA5NTk1Mjc0Nn0.dgmNiBgXRaKyXjOgpr-DkOrPuzrRI2ZDA3ig4E5JrOk'),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
})
