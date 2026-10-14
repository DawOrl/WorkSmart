import rateLimit from 'express-rate-limit';

// Demo mode serves in-memory data only, so a click-through of the whole app
// (several requests per screen) must not hit the production limit.
const isDemo = process.env.DEMO_MODE === 'true';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDemo ? 1000 : 100,  // requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

/** Stricter limiter for AI-heavy endpoints (CV analysis, letter writer) */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI request limit reached. Please wait before trying again.' },
});
