import dns from 'dns';
import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

// Some ISP/router DNS resolvers (notably on Windows) fail Node's SRV lookups
// for mongodb+srv:// URIs even though the OS resolver works fine. Falling back
// to public resolvers avoids ECONNREFUSED on `querySrv` during local dev.
dns.setServers(['8.8.8.8', '1.1.1.1', ...dns.getServers()]);

export async function connectDatabase(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.MONGODB_URI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed', error);
    throw error;
  }
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});
