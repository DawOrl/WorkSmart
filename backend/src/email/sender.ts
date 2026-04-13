import { resend, FROM_EMAIL } from '../lib/resend.js';
import type { MatchScore } from '../types/index.js';

interface AlertEmailPayload {
  to: string;
  matches: (MatchScore & { job: any })[];
  threshold: number;
}

export async function sendAlertEmail({ to, matches, threshold }: AlertEmailPayload) {
  if (process.env.DEMO_MODE === 'true') {
    console.log(`[demo] sendAlertEmail → would send to ${to}: ${matches.length} matches above ${threshold}%`);
    return;
  }
  const jobList = matches
    .map(m => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">
          <a href="${m.job?.url}" style="color:#2563eb;font-weight:500;">${m.job?.title}</a><br>
          <small style="color:#6b7280;">${m.job?.company ?? ''} · ${m.job?.location ?? ''}</small>
        </td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">
          <span style="background:#dcfce7;color:#166534;padding:2px 8px;border-radius:12px;font-weight:500;">${m.score}%</span>
        </td>
      </tr>`)
    .join('');

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `WorkSmart: ${matches.length} nowych ofert powyżej ${threshold}% dopasowania`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#111827;">Nowe oferty pracy dla Ciebie 🎯</h2>
        <p style="color:#6b7280;">Znaleźliśmy <strong>${matches.length}</strong> ofert z dopasowaniem powyżej <strong>${threshold}%</strong>.</p>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px;background:#f9fafb;">Oferta</th>
              <th style="text-align:center;padding:8px;background:#f9fafb;">Match</th>
            </tr>
          </thead>
          <tbody>${jobList}</tbody>
        </table>
        <p style="margin-top:24px;">
          <a href="${process.env.FRONTEND_URL}/dashboard" style="background:#2563eb;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:500;">
            Zobacz wszystkie oferty →
          </a>
        </p>
        <p style="color:#9ca3af;font-size:12px;margin-top:32px;">
          WorkSmart · Możesz zarządzać alertami w <a href="${process.env.FRONTEND_URL}/alerts">ustawieniach</a>.
        </p>
      </div>`,
  });
}
