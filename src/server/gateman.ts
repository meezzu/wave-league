import { Gateman } from '@random-guys/gateman';
import redis from '../common/services/redis';
import env from '../common/config/env';
import Iris from '@random-guys/iris';

const authScheme = 'Waveleague';

Iris.bootstrap(env.service_name, authScheme);

export default new Gateman({
  service: env.service_name,
  secret: env.gateman_key,
  authScheme,
  redis
});
