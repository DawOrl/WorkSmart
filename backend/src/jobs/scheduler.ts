import cron from 'node-cron';
import { runAllScrapers } from '../agents/jobScraper.js';
import { processAlerts } from '../agents/alertAgent.js';

export function startScheduler() {
  // Scrape job listings at 07:00 and 19:00 every day
  cron.schedule('0 7,19 * * *', async () => {
    console.log('[scheduler] Starting scheduled job scraping...');
    try {
      const count = await runAllScrapers();
      console.log(`[scheduler] Scraping complete. ${count} new jobs.`);
    } catch (err) {
      console.error('[scheduler] Scraping error:', err);
    }
  }, { timezone: 'Europe/Warsaw' });

  // Process alert emails every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[scheduler] Processing alerts...');
    try {
      await processAlerts();
    } catch (err) {
      console.error('[scheduler] Alert processing error:', err);
    }
  }, { timezone: 'Europe/Warsaw' });

  console.log('[scheduler] Cron jobs registered (scraping: 07:00 + 19:00, alerts: every hour)');
}
