import { subscriber } from '@random-guys/eventbus';
import { ConsumeMessage } from 'amqplib';
import faker from 'faker';
import { Day } from '../common/constants';
import { WeekNotFoundError } from '../common/errors';
import logger from '../common/services/logger';
import { LeagueRepo } from '../data/league';
import { PlayerRepo } from '../data/player';
import { PointRepo } from '../data/point';
import { SquadRepo } from '../data/squad';
import { TransferRepo } from '../data/transfer';
import { WeekRepo } from '../data/week';
import { checkConsumerCancelNotification } from './utils';

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

export async function aggregateStats(message: ConsumeMessage) {
  checkConsumerCancelNotification(message);

  const { squad_id } = JSON.parse(message.content.toString()) as {
    squad_id: string;
  };

  try {
    const [transfers, points, ranking] = await Promise.all([
      TransferRepo.get({ query: { squad: squad_id } }),
      PointRepo.get({ query: { squad: squad_id } }),
      LeagueRepo.getRanking(),
      PlayerRepo.getModel().find().limit(1)
    ]);

    const totalPoints = points
      .map(it => it.points)
      .reduce((acc, cur) => (acc += cur), 0);

    const squadRanking = ranking.findIndex(it => it._id === squad_id);

    const results = {
      transfer_count: transfers.length,
      squad_ranking: squadRanking,
      total_points: totalPoints
    };

    await SquadRepo.getModel()
      .updateOne({ _id: squad_id }, { $set: results })
      .exec();

    subscriber.acknowledgeMessage(message);
    logger.message(`stats aggregated for ${squad_id}`);
  } catch (err) {
    logger.error(err, {
      info: `an error occured while aggregating stats for ${squad_id}`,
      data: { squad_id }
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

    if (!week) {
      throw new WeekNotFoundError(payload.week_number);
    }

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
