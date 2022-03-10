import { ArtisteRepo } from '../../data/artiste';
import { TransferRepo } from '../../data/transfer';
import { FilterQuery, startSession } from 'mongoose';
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

  async addArtiste(id: string, aid: string) {
    let squad = await this.byID(id);
    if (!squad) throw new SquadNotExistsError();
    if (squad.artistes.length >= 8) throw new SquadFilledError();

    const session = await startSession();
    await session.withTransaction(async () => {
      squad = await this.model.findByIdAndUpdate(
        id,
        { $addToSet: { artistes: aid } },
        { new: true, session }
      );

      const artist = await ArtisteRepo.byID(aid);
      console.log({
        transfer_value: artist.price,
        squad: id,
        artiste: aid
      });

      await TransferRepo.getModel().create(
        [
          {
            transfer_value: artist.price,
            squad: id,
            artiste: aid
          }
        ],
        { session }
      );

      session.commitTransaction();
    });
    session.endSession();

    return squad;
  }

  async removeArtiste(id: string, artiste_id: string) {
    return this.update(id, {
      $pull: { artistes: artiste_id }
    });
  }
}
export const SquadRepo = new SquadRepository();
