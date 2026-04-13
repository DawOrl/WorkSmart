import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('Missing ANTHROPIC_API_KEY environment variable');
}

export const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/** Default model for all agents */
export const CLAUDE_MODEL = 'claude-sonnet-4-6';
