import { BaseRepository } from 'data/base';
import { ISquad } from './squad.model';
import SquadSchema from './squad.schema';

class SquadRepository extends BaseRepository<ISquad> {
  constructor() {
    super('Squad', SquadSchema);
  }

  async addArtiste(id: string, artiste_id: string) {
    return this.updateWithOperators(id, {
      $addToSet: { artistes: artiste_id }
    });
  }

  async removeArtiste(id: string, artiste_id: string) {
    return this.updateWithOperators(id, {
      $pull: { artistes: artiste_id }
    });
  }
}
export const SquadRepo = new SquadRepository();
