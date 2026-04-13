import 'dotenv/config';
import { createApp } from './app.js';
import { startScheduler } from './jobs/scheduler.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const app = createApp();

app.listen(PORT, () => {
  console.log(`[server] WorkSmart API running on http://localhost:${PORT}`);
  startScheduler();
});
