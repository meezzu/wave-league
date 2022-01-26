import { BaseRepository } from '../base';
import { CreateSquadDTO } from '.';
import { ISquad } from './squad.model';
import SquadSchema from './squad.schema';

class SquadRepository extends BaseRepository<ISquad> {
  constructor() {
    super('Squad', SquadSchema);
  }

  createSquad(body: CreateSquadDTO) {
    return this.create(body)
  }
}
export const SquadRepo = new SquadRepository();
