import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// `--mode static-demo` builds the public demo: no backend, no keys. The API
// layer answers from the shared demo data in backend/src/demo, and local .env
// files are deliberately not read (they may hold real keys).
export default defineConfig(({ mode }) => {
  const staticDemo = mode === 'static-demo';

  return {
    plugins: [react()],
    envDir: staticDemo ? path.resolve(__dirname, 'src/demo') : __dirname,
    define: staticDemo ? { 'import.meta.env.VITE_DEMO_STATIC': JSON.stringify('true') } : {},
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@demo-data': path.resolve(__dirname, '../backend/src/demo'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  };
});
