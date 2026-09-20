import mongoose from 'mongoose';
import dns from 'node:dns';
import env from './env.config.js';

// unknown fields in filters are ignored instead of returning every document
mongoose.set('strictQuery', true);

const dnsServers = (process.env.MONGO_DNS_SERVERS || '1.1.1.1,8.8.8.8')
  .split(',')
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers.length > 0) dns.setServers(dnsServers);

let listenersAttached = false;

const attachListeners = () => {
  if (listenersAttached) return;
  listenersAttached = true;

  const { connection } = mongoose;

  connection.on('connected', () => {
    console.log(`MongoDB connected: ${connection.host}/${connection.name}`);
  });
  connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
  connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });
  connection.on('error', (error) => {
    console.error(`MongoDB error: ${error.message}`);
  });
};

export const connectDB = async () => {
  attachListeners();

  try {
    await mongoose.connect(env.mongoUri, {
      // in production indexes are built once with syncIndexes, not on every boot
      autoIndex: !env.isProd,
      maxPoolSize: env.isProd ? 20 : 10,
      // fail fast if the database is not reachable
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    // server.js decides what to do (usually exit)
    throw error;
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};

// for the health check route
export const isDBConnected = () => mongoose.connection.readyState === 1;