import Stripe from 'stripe';

// ── DEMO_MODE: use placeholder key, stub checkout ────────────────────────────
if (process.env.DEMO_MODE === 'true') {
  console.log('[demo] Stripe → stubbed (checkout returns demo URL)');
}

if (process.env.DEMO_MODE !== 'true' && !process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? 'sk_test_demo_placeholder_key_worksmart',
  { apiVersion: '2025-02-24.acacia' },
);
