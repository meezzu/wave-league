import { ArtisteRepo } from '../../data/artiste';
import { TransferRepo } from '../../data/transfer';
import { FilterQuery, startSession } from 'mongoose';
import {
  ArtiteAlreadyInSquadError,
  ArtiteNotExistsError,
  ArtiteNotInSquadError,
  SquadFilledError,
  SquadNotExistsError,
  SquadWillBeFilledError
} from '../../common/errors';
import { BaseRepository } from '../base';
import { ISquad } from './squad.model';
import SquadSchema from './squad.schema';
import { xor } from 'lodash';

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

  async getOneById(id: string) {
    return this.byID(id, {
      populations: [
        { path: 'player', select: 'player_name' },
        { path: 'artistes', select: 'price avatar artiste_name record_label' }
      ]
    });
  }

  async addArtistes(id: string, artistes: string[]) {
    let [squad, artistesArray] = await Promise.all([
      this.byID(id),
      ArtisteRepo.get({ query: { _id: { $in: artistes } } })
    ]);
    if (!squad) throw new SquadNotExistsError();
    if (squad.artistes.length >= 8) throw new SquadFilledError();

    const set = new Set([...squad.artistes, ...artistes]);
    if (set.size > 8) throw new SquadWillBeFilledError();

    const absentArtistes = xor(
      artistes,
      artistesArray.map((it) => it['_id'])
    );

    // checks if an invalid artiste id was passed
    for (const absent of absentArtistes) {
      // if one artiste is found throw and exit early
      throw new ArtiteNotExistsError(absent);
    }

    // check if the artistes we're adding are already in the squad
    for (const it of artistes) {
      if (squad.artistes.includes(it)) {
        throw new ArtiteAlreadyInSquadError(it);
      }
    }

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

    return this.getOneById(id);
  }

  async removeArtistes(id: string, artistes: string[]) {
    const [squad, artitesArray] = await Promise.all([
      this.byID(id),
      ArtisteRepo.get({ query: { _id: { $in: artistes } } })
    ]);

    if (!squad) throw new SquadNotExistsError();

    const absentArtistes = xor(
      artistes,
      artitesArray.map((it) => it['_id'])
    );

    // checks if an invalid artiste id was passed
    for (const absent of absentArtistes) {
      // if one artiste is found throw and exit early
      throw new ArtiteNotExistsError(absent);
    }

    // check if the artistes we're removing are in the squad
    for (const it of artistes) {
      if (!squad.artistes.includes(it)) {
        throw new ArtiteNotInSquadError(it);
      }
    }

    const session = await startSession();
    await session.withTransaction(async () => {
      for (const aid of artistes) {
        await this.model.findByIdAndUpdate(
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

    return this.getOneById(id);
  }

  async replaceArtistes(id: string, artisteIn: string, artisteOut: string) {
    let [squad, artIn, artOut] = await Promise.all([
      this.byID(id),
      ArtisteRepo.byID(artisteIn),
      ArtisteRepo.byID(artisteIn)
    ]);

    if (!squad) throw new SquadNotExistsError();
    if (!artOut) throw new ArtiteNotExistsError(artisteIn);
    if (!artIn) throw new ArtiteNotExistsError(artisteOut);

    if (!squad.artistes.includes(artisteOut)) {
      throw new ArtiteNotInSquadError(artisteOut);
    }

    if (squad.artistes.includes(artisteIn)) {
      throw new ArtiteAlreadyInSquadError(artisteIn);
    }

    const session = await startSession();
    await session.withTransaction(async () => {
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

    return this.getOneById(id);
  }
}
export const SquadRepo = new SquadRepository();
