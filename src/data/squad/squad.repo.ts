import { ArtisteRepo } from '../../data/artiste';
import { TransferRepo } from '../../data/transfer';
import { FilterQuery, startSession } from 'mongoose';
import {
  SquadFilledError,
  SquadNotExistsError,
  SquadWillBeFilledError
} from '../../common/errors';
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

  async addArtiste(id: string, artistes: string[]) {
    let squad = await this.byID(id);
    if (!squad) throw new SquadNotExistsError();
    if (squad.artistes.length >= 8) throw new SquadFilledError();

    const set = new Set([...squad.artistes, ...artistes]);
    if (set.size > 8) throw new SquadWillBeFilledError();

    const session = await startSession();
    await session.withTransaction(async () => {
      squad = await this.model.findByIdAndUpdate(
        id,
        { $addToSet: { artistes } },
        { new: true, session }
      );

      for (const aid of artistes) {
        const artist = await ArtisteRepo.byID(aid);
        await TransferRepo.getModel().create(
          [
            {
              transfer_value: artist.price,
              transfer_type: 'in',
              artiste: aid,
              squad: id
            }
          ],
          { session }
        );
      }

      session.commitTransaction();
    });
    session.endSession();

    return squad;
  }

  async removeArtiste(id: string, artistes: string[]) {
    let squad = await this.byID(id);
    if (!squad) throw new SquadNotExistsError();

    const session = await startSession();
    await session.withTransaction(async () => {
      for (const aid of artistes) {
        squad = await this.model.findByIdAndUpdate(
          id,
          { $pull: { artistes: aid } },
          { new: true, session }
        );

        const artist = await ArtisteRepo.byID(aid);
        await TransferRepo.getModel().create(
          [
            {
              transfer_value: artist.price,
              transfer_type: 'out',
              artiste: aid,
              squad: id
            }
          ],
          { session }
        );
      }

      session.commitTransaction();
    });
    session.endSession();

    return squad;
  }

  async replaceArtistes(id: string, artisteIn: string, artisteOut: string) {
    let squadExists = await this.model.exists({ _id: id });
    if (!squadExists) throw new SquadNotExistsError();

    const session = await startSession();
    await session.withTransaction(async () => {
      const [artIn, artOut] = await Promise.all([
        ArtisteRepo.byID(artisteIn),
        ArtisteRepo.byID(artisteIn)
      ]);

      await Promise.all([
        this.model.findByIdAndUpdate(
          id,
          { $addToSet: { artistes: artisteIn } },
          { new: true, session }
        ),
        this.model.findByIdAndUpdate(
          id,
          { $pull: { artistes: artisteOut } },
          { new: true, session }
        ),
        TransferRepo.getModel().create(
          [
            {
              transfer_value: artIn.price,
              transfer_type: 'in',
              artiste: artisteIn,
              squad: id
            },
            {
              transfer_value: artOut.price,
              transfer_type: 'out',
              artiste: artisteOut,
              squad: id
            }
          ],
          { session }
        )
      ]);

      session.commitTransaction();
    });
    session.endSession();

    return this.byID(id, {
      populations: [
        { path: 'player', select: 'player_name' },
        { path: 'artistes', select: 'price avatar artiste_name record_label' }
      ]
    });
  }
}
export const SquadRepo = new SquadRepository();
