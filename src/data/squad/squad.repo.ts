import { BaseRepository } from 'data/base';
import { ISquad } from './squad.model';
import SquadSchema from './squad.schema';

class SquadRepository extends BaseRepository<ISquad> {
  constructor() {
    super('Squad', SquadSchema);
  }
}
export const SquadRepo = new SquadRepository();
