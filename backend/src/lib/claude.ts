import Anthropic from '@anthropic-ai/sdk';

// ── DEMO_MODE: skip API key requirement, export a no-op stub ─────────────────
if (process.env.DEMO_MODE === 'true') {
  console.log('[demo] Claude API → stubbed (agents return pre-written responses)');
}

if (process.env.DEMO_MODE !== 'true' && !process.env.ANTHROPIC_API_KEY) {
  throw new Error('Missing ANTHROPIC_API_KEY environment variable');
}

export const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'demo-key-placeholder',
});

/** Default model for all agents */
export const CLAUDE_MODEL = 'claude-sonnet-4-6';
