import { Router } from 'express';
import type { Request, Response } from 'express';
import { stripe } from '../lib/stripe.js';
import { supabase } from '../lib/supabase.js';

const router = Router();

/** POST /api/webhooks/stripe */
router.post('/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    res.status(400).json({ error: 'Webhook signature invalid' });
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;
      if (userId && plan) {
        await supabase
          .from('profiles')
          .update({ plan, stripe_customer_id: session.customer as string })
          .eq('id', userId);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', sub.customer as string)
        .single();
      if (profile) {
        await supabase.from('profiles').update({ plan: 'free' }).eq('id', profile.id);
      }
      break;
    }
  }

  res.json({ received: true });
});

export default router;
