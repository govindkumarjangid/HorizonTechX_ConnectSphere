import https from 'https';
import http from 'http';

const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

export const startKeepAliveCron = () => {
  // Read URL solely from environment variables (Render automatically sets RENDER_EXTERNAL_URL)
  const baseUrl =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.BACKEND_URL ||
    process.env.SERVER_URL;

  if (!baseUrl) {
    console.log(
      '[Cron Keep-Alive] Disabled: Neither RENDER_EXTERNAL_URL nor BACKEND_URL is set in environment.'
    );
    return;
  }

  const pingUrl = `${baseUrl.trim().replace(/\/+$/, '')}/api/health`;

  console.log(`[Cron Keep-Alive] Initialized. Target: ${pingUrl} (Interval: 14 mins)`);

  // Initial warmup ping after 30 seconds
  const initialTimer = setTimeout(() => {
    sendPing(pingUrl);
  }, 30_000);
  if (initialTimer.unref) initialTimer.unref();

  // Recurring 14-minute interval to keep service awake
  const intervalTimer = setInterval(() => {
    sendPing(pingUrl);
  }, PING_INTERVAL_MS);
  if (intervalTimer.unref) intervalTimer.unref();
};

const sendPing = (url) => {
  try {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;

    const req = client.get(url, { timeout: 15_000 }, (res) => {
      console.log(
        `[Cron Keep-Alive] Ping sent to ${url} -> Status: ${res.statusCode} at ${new Date().toISOString()}`
      );
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn(`[Cron Keep-Alive] Ping timeout for ${url}`);
    });

    req.on('error', (err) => {
      console.warn(`[Cron Keep-Alive] Ping warning: ${err.message}`);
    });
  } catch (err) {
    console.warn(`[Cron Keep-Alive] Error sending ping: ${err.message}`);
  }
};

export default {
  startKeepAliveCron,
};
