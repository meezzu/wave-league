import { BaseRepository } from '../base';
import { startSession } from 'mongoose';
import { ILeague } from './league.model';
import LeagueSchema from './league.schema';
import { WeekRepo } from '../../data/week';
import { PointRepo } from '../../data/point';
import { SquadRepo } from '../../data/squad';
import {
  LeagueNotExistsError,
  SquadNotExistsError,
  LeagueFilledError,
  SquadAlreadyInLeagueError,
  SquadNotInLeagueError
} from '../../common/errors'
class LeagueRepository extends BaseRepository<ILeague> {
  constructor() {
    super('League', LeagueSchema);
  }

  async getOne(id: string): Promise<ILeague> {
    const league = await this.byID(id, {
      populations: [{ path: 'squads', select: 'squad_name' }]
    });
    const { squads, ...rest } = league['_doc'];
    const newSquads = [];
    for (const squad of squads) {
      const thisWeek = await WeekRepo.getModel()
        .find()
        .sort({ created_at: -1 })
        .limit(1);
      const week_number = thisWeek[0].week_number;
      const points = await PointRepo.getPoints(squad.artistes, week_number);
      squad.points = points;
      newSquads.push(squad);
    }
    rest['squads'] = newSquads;
    if (!league) throw new LeagueNotExistsError();

    return rest as ILeague;
  }

  async addSquad(id: string, squad: string) {
    const [league, squadArray] = await Promise.all([
      this.byID(id),
      SquadRepo.get({ query: { _id: { $in: squad } } })
    ]);
    if (!league) throw new LeagueNotExistsError();
    if (!squadArray) throw new SquadNotExistsError();
    if (league.squads.length >= league.squad_limit)
      throw new LeagueFilledError();

    // check if the artistes we're adding are already in the squad
    if (league.squads.includes(squad)) {
      throw new SquadAlreadyInLeagueError(squad);
    }

    const session = await startSession();
    await session.withTransaction(async () => {
      await this.model
        .updateOne(
          {
            _id: id
          },
          {
            $addToSet: {
              squads: squad
            }
          },
          { session, new: true }
        )
        .exec();

      session.commitTransaction();
    });
    session.endSession();

    return this.getOne(id);
  }

  async removeSquad(id: string, squad: string) {
    const [league, squadArray] = await Promise.all([
      this.byID(id),
      SquadRepo.get({ query: { _id: { $in: squad } } })
    ]);
    if (!league) throw new LeagueNotExistsError();
    if (!squadArray) throw new SquadNotExistsError();

    // check if the artistes we're adding are already in the squad

    if (!league.squads.includes(squad)) {
      throw new SquadNotInLeagueError(squad);
    }

    const session = await startSession();
    await session.withTransaction(async () => {
      await this.model
        .updateOne(
          {
            _id: id
          },
          {
            $pull: {
              squads: squad
            }
          },

          { session, new: true }
        )

        .exec();

      session.commitTransaction();
    });
    session.endSession();

    return this.getOne(id);
  }
}

export const LeagueRepo = new LeagueRepository();
