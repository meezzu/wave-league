import { Gateman } from '@random-guys/gateman';
import redis from '../common/services/redis';
import env from '../common/config/env';
import { Hour } from '../common/constants';

const authScheme = 'Waveleague';

export default new Gateman({
  service: env.service_name,
  secret: env.gateman_key,
  sessionDuration: Hour,
  authScheme,
  redis
});
