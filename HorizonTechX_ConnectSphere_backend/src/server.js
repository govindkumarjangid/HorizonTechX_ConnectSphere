import env from '../src/configs/env.config.js';
import { connectDB, disconnectDB } from '../src/configs/db.config.js';
import app from './app.js';
import { SHUTDOWN_TIMEOUT_MS } from "./constents.js"


let server;
let shuttingDown = false;

const shutdown = async (reason, exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${reason}: shutting down`);

  // do not hang forever if a connection refuses to close
  setTimeout(() => {
    console.error('Shutdown timed out, forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();

  try {
    if (server?.listening)
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    await disconnectDB();
    console.log('Shutdown complete');
    process.exit(exitCode);
  } catch (error) {
    console.error(`Shutdown failed: ${error.message}`);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  shutdown('unhandledRejection', 1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  shutdown('uncaughtException', 1);
});

const start = async () => {
  await connectDB();
  server = app.listen(env.port, () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}...`);
  });

  // Render/AWS load balancers keep connections open longer than Node's 5s default,
  // which causes random 502 errors
  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;

  server.on('error', (error) => {
    console.error(`Server error: ${error.message}`);
    shutdown('server error', 1);
  });
};

start().catch((error) => {
  console.error(`Failed to start: ${error.message}`);
  process.exit(1);
});