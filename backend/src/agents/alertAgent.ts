import { supabase } from '../lib/supabase.js';
import { sendAlertEmail } from '../email/sender.js';

/** Check all active alerts and send emails for matches above threshold */
export async function processAlerts(): Promise<void> {
  const { data: alerts } = await supabase
    .from('alerts')
    .select('*, user:profiles(email)')
    .eq('is_active', true);

  if (!alerts || alerts.length === 0) return;

  for (const alert of alerts) {
    const user = alert.user as { email: string } | null;
    if (!user?.email) continue;

    // Find new high-match jobs since last alert
    let query = supabase
      .from('match_scores')
      .select('*, job:job_listings(*)')
      .eq('user_id', alert.user_id)
      .gte('score', alert.min_score)
      .order('computed_at', { ascending: false })
      .limit(5);

    if (alert.last_sent_at) {
      query = query.gt('computed_at', alert.last_sent_at);
    }

    const { data: matches } = await query;

    if (!matches || matches.length === 0) continue;

    try {
      await sendAlertEmail({
        to: user.email,
        matches: matches as any[],
        threshold: alert.min_score,
      });

      await supabase
        .from('alerts')
        .update({ last_sent_at: new Date().toISOString() })
        .eq('id', alert.id);

      console.log(`[alertAgent] Sent alert to ${user.email} (${matches.length} matches)`);
    } catch (err) {
      console.error(`[alertAgent] Failed to send alert to ${user.email}:`, err);
    }
  }
}
