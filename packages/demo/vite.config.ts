import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@sensitiveweb/react-prize-wheel': resolve(__dirname, '../react-prize-wheel/src'),
    },
  },
  server: {
    port: 3000,
  },
});
