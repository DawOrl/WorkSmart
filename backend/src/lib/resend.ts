import { Resend } from 'resend';

// ── DEMO_MODE: skip API key requirement, emails are logged to console ─────────
if (process.env.DEMO_MODE === 'true') {
  console.log('[demo] Resend → stubbed (emails logged to console only)');
}

if (process.env.DEMO_MODE !== 'true' && !process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

export const resend = new Resend(process.env.RESEND_API_KEY ?? 're_demo_placeholder');

export const FROM_EMAIL = 'WorkSmart <noreply@worksmart.pl>';
