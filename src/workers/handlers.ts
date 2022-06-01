import { subscriber } from '@random-guys/eventbus';
import { ConsumeMessage } from 'amqplib';
import { ScoreRepo } from '../data/score';
import faker from 'faker';
import { startSession } from 'mongoose';
import { Day } from '../common/constants';
import logger from '../common/services/logger';
import { ArtisteRepo } from '../data/artiste';
import { LeagueRepo } from '../data/league';
import { PlayerRepo } from '../data/player';
import { PointRepo } from '../data/point';
import { SquadRepo } from '../data/squad';
import { TransferRepo } from '../data/transfer';
import { WeekRepo } from '../data/week';
import { checkConsumerCancelNotification } from './utils';

/**
 * The job that assigns points to artistes runs weekly on prod and daily on dev
 * 1. Create the new week
 * 2. For every existing artiste, assign new points for this week
 * 3. For every existing squad with a complete roster, calculate the points of the existing roster
 * 4. For every existing squad compute weekly stats and save it to the squad
 */
export async function createWeek(message: ConsumeMessage) {
  checkConsumerCancelNotification(message);

  const { week_number } = JSON.parse(message.content.toString()) as {
    week_number: number;
  };

  try {
    const session = await startSession();
    await session.withTransaction(async () => {
      // 1. Create a new week
      const [week] = await WeekRepo.getModel().create(
        [
          {
            week_number,
            start_date: new Date(),
            end_date: new Date(Date.now() + Day)
          }
        ],
        { session }
      );
      logger.message(`week ${week_number} created`);

      // 2. For every existing artiste, assign new points for this week
      const artistesCursor = ArtisteRepo.getModel().find().lean().cursor();
      const points = [];
      await artistesCursor.eachAsync(artiste =>
        points.push({
          points: faker.random.number({ min: 0, max: 100 }),
          week_number: week_number,
          artiste: artiste._id,
          week: week._id
        })
      );

      await PointRepo.getModel().create(points, { session });
      logger.message(`week ${week_number} points for artistes created`);

      // 3. For every existing squad with a complete roster, calculate the points of the existing roster
      let squadCursor = SquadRepo.getModel().find().lean().cursor();
      const scores = [];
      await squadCursor.eachAsync(async squad => {
        const points = await PointRepo.get({
          query: {
            artiste: { $in: squad.artistes },
            week_number
          },
          session
        });

        const squadScore = points
          .map(it => it.points)
          .reduce((acc, cur) => acc + cur, 0);

        scores.push({
          week: week._id,
          score: squadScore,
          squad: squad._id,
          week_number
        });
      });

      await ScoreRepo.getModel().create(scores, { session });
      logger.message(`week ${week_number} scores for squads created`);

      // 4. For every existing squad compute weekly stats and save it to the squad
      squadCursor = SquadRepo.getModel().find().lean().cursor();
      await squadCursor.eachAsync(async squad => {
        const [transfers, scores, ranking] = await Promise.all([
          TransferRepo.get({ query: { squad: squad._id }, session }),
          ScoreRepo.get({ query: { squad: squad._id }, session }),
          LeagueRepo.getRanking(),
          PlayerRepo.getModel().find().limit(1)
        ]);

        const totalPoints = scores
          .map(it => it.score)
          .reduce((acc, cur) => acc + cur, 0);

        const squadRanking = ranking.findIndex(it => it._id === squad._id);

        const results = {
          transfer_count: transfers.length,
          squad_ranking: squadRanking + 1,
          total_points: totalPoints
        };

        await SquadRepo.getModel()
          .updateOne({ _id: squad._id }, { $set: results }, { session })
          .exec();

        logger.message(`week ${week_number} stats aggregated for ${squad._id}`);
      });

      await session.commitTransaction();
    });
    session.endSession();

    subscriber.acknowledgeMessage(message);
    logger.message('done');
  } catch (err) {
    logger.error(err, {
      info: `an error occured while creating week ${week_number}`,
      data: { week_number }
    });
  }
}
