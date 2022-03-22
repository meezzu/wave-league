import express, { Request, Response } from 'express';
import http from 'http';
import env from '../common/config/env';
import logger from '../common/services/logger';
import { QUEUE_POINTS_ASSIGN, QUEUE_WEEKS_CREATE } from '../common/constants';
import { subscriber } from '@random-guys/eventbus';
import redis from '../common/services/redis';
import db from '../server/db';
import { assignPointsToArtist, createWeek } from './handlers';

let httpServer: http.Server;
const app = express();

/**
 * Starts the worker
 */
export const startWorker = async () => {
  try {
    if (!env.worker_port && !env.port)
      throw new Error('Worker http port not specified. Exiting...');

    const port = env.worker_port || env.port;

    await db.connect();
    logger.message('📦  MongoDB Connected!');

    await subscriber.init(env.amqp_url);
    logger.message('🚎  Event Bus Publisher ready!');

    const subscriberConnection = subscriber.getConnection();
    subscriberConnection.on('error', (err: Error) => {
      logger.error(err);
      process.exit(1);
    });

    // Attach handlers
    await subscriber.consume(QUEUE_WEEKS_CREATE, createWeek);
    await subscriber.consume(QUEUE_POINTS_ASSIGN, assignPointsToArtist, 10);

    // Start simple server for k8s health check
    app.get('/', (req: Request, res: Response) => {
      res.status(200).json({ status: 'UP' });
    });
    httpServer = app.listen(port);

    logger.message(
      `📇  waveleague-worker ready!. Health check on port ${port}`
    );
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

/**
 * Stops the worker
 */
export const stopWorker = async () => {
  try {
    await subscriber.getConnection().close();
    await db.disconnect();
    await redis.quit();
    if (httpServer) httpServer.close();
  } catch (err) {
    logger.error(err, 'An error occured while stopping Contacts worker');
    process.exit(1);
  }
};
