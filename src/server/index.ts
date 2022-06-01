import { publisher } from '@random-guys/eventbus';
import http from 'http';
import env from '../common/config/env';
import { CRON_DAILY_MIDNIGHT_UTC, JOB_WEEKS_CREATE } from '../common/constants';
import logger from '../common/services/logger';
import { jobRunner } from '../jobs';
import App from './app';
import db from './db';

const start = async () => {
  try {
    const app = new App();
    const appServer = app.getServer();
    const httpServer = http.createServer(appServer);

    await db.connect();
    logger.message('📦  MongoDB Connected!');

    // start job runner
    await jobRunner.start();

    // set cron interval
    await jobRunner.every(CRON_DAILY_MIDNIGHT_UTC, JOB_WEEKS_CREATE);

    db.connection.once('close', async () => {
      await jobRunner.stop();
    });

    logger.message(`⏰  Job Runner ready`);

    await publisher.init(env.amqp_url);
    logger.message('🚎  Event Bus Publisher ready!');

    httpServer.listen(env.port);
    httpServer.on('listening', () =>
      logger.message(
        `🚀  ${env.service_name} running in ${env.app_env}. Listening on ` +
          env.port
      )
    );
  } catch (err) {
    logger.error(err, 'Fatal server error');
  }
};

start();

process.once('SIGINT', () => {
  const pubConnection = publisher.getConnection();
  if (pubConnection) pubConnection.close();
});
