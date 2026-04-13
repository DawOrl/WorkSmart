import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../middleware/validate.js';
import { stripe } from '../lib/stripe.js';

const router = Router();

const checkoutSchema = z.object({
  plan: z.enum(['pro', 'premium']),
});

/** POST /api/payments/checkout – create Stripe Checkout session */
router.post(
  '/checkout',
  requireAuth,
  validateBody(checkoutSchema),
  asyncHandler(async (req, res) => {
    const { plan } = req.body as z.infer<typeof checkoutSchema>;
    const priceId = plan === 'pro'
      ? process.env.STRIPE_PRO_PRICE_ID
      : process.env.STRIPE_PREMIUM_PRICE_ID;

    if (!priceId) {
      res.status(500).json({ error: 'Price ID not configured' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card', 'blik'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: req.user!.email,
      metadata: { user_id: req.user!.id, plan },
      success_url: `${process.env.FRONTEND_URL}/settings?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
    });

    res.json({ url: session.url });
  }),
);

export default router;
