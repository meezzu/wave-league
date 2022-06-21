import { ClientSession } from 'mongoose';
import {
  LeagueNotExistsError,
  SquadNotExistsError,
  LeagueFilledError,
  SquadAlreadyInLeagueError,
  SquadNotInLeagueError
} from '../../common/errors';
import { PointRepo } from '../../data/point';
import { SquadRepo } from '../../data/squad';
import { IWeek, WeekRepo } from '../../data/week';
import { BaseRepository } from '../base';
import { ILeague } from './league.model';
import LeagueSchema from './league.schema';

class LeagueRepository extends BaseRepository<ILeague> {
  constructor() {
    super('League', LeagueSchema);
  }

  async getOne(id: string): Promise<ILeague> {
    const league = await this.byID(id, {
      populations: [{ path: 'squads', select: 'squad_name artistes' }]
    });

    if (!league) throw new LeagueNotExistsError();

    const { squads, ...rest } = league['_doc'];

    const thisWeek = await WeekRepo.getModel()
      .find()
      .sort({ created_at: -1 })
      .limit(1);

    const newSquads = [];
    for (const squad of squads) {
      const week_number = thisWeek[0].week_number;
      const points = await PointRepo.getPoints(squad.artistes, week_number);

      newSquads.push({ _id: squad.id, squad_name: squad.squad_name, points });
    }

    rest['squads'] = newSquads;

    return rest as ILeague;
  }

  async addSquad(id: string, squad_id: string): Promise<ILeague> {
    const [league, squad] = await Promise.all([
      this.byID(id),
      SquadRepo.byID(squad_id)
    ]);

    if (!league) throw new LeagueNotExistsError();
    if (!squad) throw new SquadNotExistsError();

    if (league.squads.length >= league.squad_limit)
      throw new LeagueFilledError();

    // check if the squad we're adding is already in the league
    if (league.squads.includes(squad_id)) {
      throw new SquadAlreadyInLeagueError(squad.squad_name);
    }

    await this.model
      .updateOne(
        {
          _id: id
        },
        {
          $addToSet: {
            squads: squad_id
          }
        }
      )
      .exec();

    return this.getOne(id);
  }

  async removeSquad(id: string, squad_id: string): Promise<ILeague> {
    const [league, squad] = await Promise.all([
      this.byID(id),
      SquadRepo.byID(squad_id)
    ]);

    if (!league) throw new LeagueNotExistsError();
    if (!squad) throw new SquadNotExistsError();

    // check if the squad we're removing is actually in the league
    if (!league.squads.includes(squad_id)) {
      throw new SquadNotInLeagueError(squad_id);
    }

    await this.model
      .updateOne(
        {
          _id: id
        },
        {
          $pull: {
            squads: squad_id
          }
        }
      )

      .exec();

    return this.getOne(id);
  }

  async getRanking(id: string = 'general', week_number: number = 0) {
    let thisWeek: IWeek;
    if (isNaN(week_number)) {
      [thisWeek] = await WeekRepo.getModel()
        .find()
        .sort({ created_at: -1 })
        .limit(1);
    } else {
      thisWeek = await WeekRepo.getModel().findOne({ week_number });
    }

    const league = await this.byID(id, {
      populations: {
        model: 'Squad',
        path: 'squads',
        select: 'squad_name player artistes total_points',
        populate: {
          model: 'Player',
          path: 'player',
          select: 'player_name'
        }
      }
    });

    if (!league) throw new LeagueNotExistsError();

    const newSquads = [];
    const squads = league.squads as any[];

    for (let i = 0; i < squads.length; i++) {
      const squad = squads[i];

      const points = await PointRepo.getPoints(
        squad.artistes,
        thisWeek.week_number
      );

      newSquads.push({
        _id: squad.id,
        week: thisWeek.week_number,
        points,
        total_points: squad.total_points,
        squad_name: squad.squad_name,
        player_name: squad.player.player_name
      });
    }

    if (isNaN(week_number)) {
      return newSquads.sort((a, b) => b.total_points - a.total_points);
    } else {
      return newSquads.sort((a, b) => b.points - a.points);
    }
  }

  async getWeeklyRanking(
    id: string,
    week_number: number,
    session: ClientSession
  ) {
    let thisWeek: IWeek;
    if (isNaN(week_number)) {
      [thisWeek] = await WeekRepo.getModel()
        .find({})
        .session(session)
        .lean()
        .sort({ created_at: -1 })
        .limit(1);
    } else {
      thisWeek = await WeekRepo.getModel()
        .findOne({ week_number })
        .session(session)
        .lean();
    }

    const league = await this.byID(id, {
      populations: {
        model: 'Squad',
        path: 'squads',
        select: 'squad_name player artistes total_points',
        populate: {
          model: 'Player',
          path: 'player',
          select: 'player_name'
        }
      }
    });

    if (!league) throw new LeagueNotExistsError();

    const newSquads = [];
    const squads = league.squads as any[];

    for (let i = 0; i < squads.length; i++) {
      const squad = squads[i];

      const points = await PointRepo.get({
        query: {
          artiste: { $in: squad.artistes },
          week_number: thisWeek.week_number
        },
        session
      });

      newSquads.push({
        _id: squad.id,
        week: thisWeek.week_number,
        points,
        total_points: squad.total_points,
        squad_name: squad.squad_name,
        player_name: squad.player.player_name
      });
    }

    if (isNaN(week_number)) {
      return newSquads.sort((a, b) => b.total_points - a.total_points);
    } else {
      return newSquads.sort((a, b) => b.points - a.points);
    }
  }
}

export const LeagueRepo = new LeagueRepository();
