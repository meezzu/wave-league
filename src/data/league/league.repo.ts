import { BaseRepository } from '../base';
import { ILeague } from './league.model';
import LeagueSchema from './league.schema';

class LeagueRepository extends BaseRepository<ILeague> {
  constructor() {
    super('League', LeagueSchema);
  }
}

export const LeagueRepo = new LeagueRepository();
