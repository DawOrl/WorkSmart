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
    // Values set in the shell or in the Vercel dashboard still reach import.meta.env,
    // so the static demo pins every key-bearing variable to an empty string.
    define: staticDemo
      ? {
          'import.meta.env.VITE_DEMO_STATIC': JSON.stringify('true'),
          'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(''),
          'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(''),
          'import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY': JSON.stringify(''),
          'import.meta.env.VITE_API_URL': JSON.stringify(''),
        }
      : {},
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@demo-data': path.resolve(__dirname, '../backend/src/demo'),
        // The demo never talks to Supabase: swap the SDK for a stub so it is not bundled at all.
        ...(staticDemo ? { '@supabase/supabase-js': path.resolve(__dirname, 'src/demo/supabaseStub.ts') } : {}),
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
