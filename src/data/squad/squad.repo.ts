import { FilterQuery } from 'mongoose';
import { SquadFilledError, SquadNotExistsError } from '../../common/errors';
import { BaseRepository } from '../base';
import { ISquad } from './squad.model';
import SquadSchema from './squad.schema';

class SquadRepository extends BaseRepository<ISquad> {
  constructor() {
    super('Squad', SquadSchema);
  }

  async getOne(id: string) {
    const query = this.getQuery(id) as FilterQuery<ISquad>;
    return this.model
      .findOne(query)
      .populate('artistes', 'price avatar artiste_name record_label')
      .exec();
  }

  async addArtiste(id: string, artiste_id: string) {
    const squad = await this.byID(id);

    if (!squad) throw new SquadNotExistsError();
    if (squad.artistes.length == 8) throw new SquadFilledError();

    return this.update(id, {
      $addToSet: { artistes: artiste_id }
    });
  }

  async removeArtiste(id: string, artiste_id: string) {
    return this.update(id, {
      $pull: { artistes: artiste_id }
    });
  }
}
export const SquadRepo = new SquadRepository();
