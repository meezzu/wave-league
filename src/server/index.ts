// allow creation of aliases for directories
import 'module-alias/register';

import http from 'http';
import { publisher } from '@random-guys/eventbus';
import App from './app';
import DB from './db';
import env from '../common/config/env';
import logger from '../common/services/logger';

const start = async () => {
  try {
    const app = new App();
    const appServer = app.getServer();
    const httpServer = http.createServer(appServer);

    await DB.connect();
    logger.message('📦  MongoDB Connected!');

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
