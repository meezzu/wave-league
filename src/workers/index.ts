import { startWorker, stopWorker } from './bootstrap';

startWorker();

process.on('SIGINT', async () => await stopWorker());