import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment variables required for all environments (development, test, staging, production)
 */
const requiredVariables = ['port', 'amqp_url', 'redis_url', 'gateman_key'];

/**
 * Environment variables required for both staging and production
 */
const productionAndStagingVariables = ['mongodb_url', 'redis_password'];

/**
 * Requires MongoDB and Redis credentials in production and staging, else uses Redis and MongoDB connection string directly
 * in dev or any other environment
 */
if (['production', 'staging'].includes(process.env.NODE_ENV))
  requiredVariables.push(...productionAndStagingVariables);
else requiredVariables.push('mongodb_url');

const env = {
  /**
   * NodeJS runtime environment. See here https://stackoverflow.com/a/16979503
   * Possible values are "development" and "production".
   *
   * DON'T SET THIS MANUALLY
   */
  node_env: process.env.NODE_ENV || 'development',

  /**
   * This application's runtime environment
   * Possible values are "development", "test", "production", "staging"
   */
  app_env: process.env.APP_ENV || 'development',

  port: Number(process.env.PORT),
  worker_port: Number(process.env.WORKER_PORT),
  salt_rounds: Number(process.env.SALT_ROUNDS) || 10,

  amqp_url: process.env.AMQP_URL,
  redis_url: process.env.REDIS_URL,
  mongodb_url: process.env.MONGODB_URL,

  service_name: process.env.SERVICE_NAME || 'wavelague',
  gateman_key: process.env.GATEMAN_KEY,

  redis_password: process.env.REDIS_PASSWORD,

  boomplay_url: process.env.BOOMPLAY_URL,
  kworb_url: process.env.KWORB_URL
};

const missingVariables = requiredVariables.reduce(
  (acc, varName) => (!env[varName] ? acc.concat(varName.toUpperCase()) : acc),
  []
);

if (!!missingVariables.length)
  throw new Error(
    `The following required variables are missing: ${missingVariables}`
  );

export default env;
