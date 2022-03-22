import { subscriber } from '@random-guys/eventbus';
import { ConsumeMessage } from 'amqplib';
import { checkConsumerCancelNotification } from './utils';
import logger from '../common/services/logger';
import { WeekRepo } from '../data/week';
import faker from 'faker';
import { PointRepo } from '../data/point';
import { Day } from '../common/constants';

export async function createWeek(message: ConsumeMessage) {
  checkConsumerCancelNotification(message);

  const payload = JSON.parse(message.content.toString()) as {
    week_number: number;
  };

  try {
    await WeekRepo.create({
      week_number: payload.week_number,
      start_date: new Date(),
      end_date: new Date(Date.now() + Day)
    } as any);

    subscriber.acknowledgeMessage(message);
    logger.message(`week ${payload.week_number} created`);
  } catch (err) {
    logger.error(err, {
      info: `an error occured while creating week ${payload.week_number}`,
      data: payload
    });
  }
}

export async function assignPointsToArtist(message: ConsumeMessage) {
  checkConsumerCancelNotification(message);

  const payload = JSON.parse(message.content.toString()) as {
    week_number: number;
    artiste: string;
  };

  try {
    const week = await WeekRepo.byQuery({
      week_number: payload.week_number
    });

    await PointRepo.create({
      points: faker.random.number({ min: 0, max: 100 }),
      week_number: week.week_number,
      artiste: payload.artiste,
      week: week._id
    } as any);

    subscriber.acknowledgeMessage(message);
    logger.message(
      `week ${payload.week_number} points for ${payload.artiste} created`
    );
  } catch (err) {
    logger.error(err, {
      info: `An error occured while creating week ${payload.week_number} points for ${payload.artiste}`,
      data: payload
    });
  }
}
