/** Fully static demo: no backend, the API is answered in the browser. */
export const isStaticDemo = import.meta.env.VITE_DEMO_STATIC === 'true';

/** Any demo: mock sign-in, sample data, nothing leaves the browser or the local API. */
export const isDemo = isStaticDemo || import.meta.env.VITE_DEMO_MODE === 'true';
