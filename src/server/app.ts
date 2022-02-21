import express, { Application, Router } from 'express';
import responseTime from 'response-time';
import requestID from 'express-request-id';
import cors from 'cors';
import helmet from 'helmet';
import loggerMiddleware from './middleware/requestLogger';
import jsend from './middleware/jsend';
import { logResponseBody } from './middleware/logResponseBody';
import { MetricsService } from '../server/services';
import v1Router from '../routes';

export default class App {
  private server: Application;

  constructor() {
    this.server = express();

    this.registerMiddlewares();
    this.registerHandlers();
  }

  /**
   * Registers middlewares on the application server
   */
  private registerMiddlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));

    this.server.disable('x-powered-by');
    this.server.use(helmet());
    this.server.use(cors());
    this.server.use(responseTime());
    this.server.use(requestID());

    this.server.use(loggerMiddleware);
    this.server.use(logResponseBody);

    this.server.use(jsend);
  }

  /**
   * Registers utility handlers
   */
  private registerHandlers() {
    const router = Router();
    router.use('/v1', v1Router);

    this.server.use('/api', router);

    this.server.get('/', (req, res) => {
      res.status(200).json({ status: 'UP' });
    });

    this.server.post('/', (req, res) => {
      return res.status(200).json({ key: 'value' });
    });

    this.server.get('/metrics', MetricsService.send);

    this.server.use((req, res, next) => {
      res.status(404).send("Whoops! Route doesn't exist.");
    });
  }

  /**
   * Applies all routes and configuration to the server, returning the express application server.
   */
  getServer() {
    return this.server;
  }
}
