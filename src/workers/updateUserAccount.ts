import { subscriber } from '@random-guys/eventbus';
import { ConsumeMessage } from 'amqplib';
import { checkConsumerCancelNotification } from './utils';
import faker from 'faker';
import logger from '../common/services/logger';
import { PlayerRepo } from 'data/player';

/**
 * Updates a user's account details
 * @param message the message on the queue
 */
export default async function updateUserAccount(message: ConsumeMessage) {
  checkConsumerCancelNotification(message);

  const payload = JSON.parse(message.content.toString());

  try {
    subscriber.acknowledgeMessage(message);

    await PlayerRepo.update(payload.id, {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName()
    });

    logger.message('User account updated');
  } catch (err) {
    logger.error(err, {
      info: 'An error occured while updating the User account details',
      data: payload
    });
  }
}
