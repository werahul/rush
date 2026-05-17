import app from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { logger } from './utils/logger';

async function bootstrap() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    logger.info(`RUSH API running on port ${env.PORT} [${env.NODE_ENV}]`);
    logger.info(`Client URL: ${env.CLIENT_URL}`);
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
