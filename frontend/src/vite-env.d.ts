/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  /** "true": mock auth, API served by the backend running with DEMO_MODE=true */
  readonly VITE_DEMO_MODE?: string;
  /** "true": fully static demo, API answered in the browser (set by --mode static-demo) */
  readonly VITE_DEMO_STATIC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
