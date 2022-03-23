import { ArtisteRepo } from '../../data/artiste';
import { TransferRepo } from '../../data/transfer';
import { startSession } from 'mongoose';
import {
  ArtisteAlreadyInSquadError,
  ArtisteNotExistsError,
  ArtisteNotInSquadError,
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
    return this.byID(id, {
      populations: [
        { path: 'player', select: 'player_name' },
        {
          path: 'artistes.artiste_id',
          select: 'price avatar artiste_name record_label'
        }
      ]
    });
  }

  async addArtistes(id: string, artistes: string[]) {
    const [squad, artistesArray] = await Promise.all([
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
      throw new ArtisteNotExistsError(absent);
    }

    // check if the artistes we're adding are already in the squad
    for (const it of artistes) {
      if (squad.artistes.map((it) => it.artiste_id).includes(it)) {
        throw new ArtisteAlreadyInSquadError(it);
      }
    }

    const session = await startSession();
    await session.withTransaction(async () => {
      for (const aid of artistes) {
        await this.model
          .updateOne(
            { _id: id },
            {
              $addToSet: {
                artistes: { artiste_id: aid, is_on_stage: true }
              }
            },
            { session }
          )
          .exec();

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

    return this.getOne(id);
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
      throw new ArtisteNotExistsError(absent);
    }

    // check if the artistes we're removing are in the squad
    for (const it of artistes) {
      if (!squad.artistes.map((it) => it.artiste_id).includes(it)) {
        throw new ArtisteNotInSquadError(it);
      }
    }

    const session = await startSession();
    await session.withTransaction(async () => {
      for (const aid of artistes) {
        await this.model
          .updateOne(
            { _id: id },
            { $pull: { artistes: { artiste_id: aid } } },
            { session }
          )
          .exec();

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

    return this.getOne(id);
  }

  async replaceArtistes(id: string, artisteIn: string, artisteOut: string) {
    const [squad, artIn, artOut] = await Promise.all([
      this.byID(id),
      ArtisteRepo.byID(artisteIn),
      ArtisteRepo.byID(artisteIn)
    ]);

    if (!squad) throw new SquadNotExistsError();
    if (!artOut) throw new ArtisteNotExistsError(artisteIn);
    if (!artIn) throw new ArtisteNotExistsError(artisteOut);

    if (!squad.artistes.map((it) => it.artiste_id).includes(artisteOut)) {
      throw new ArtisteNotInSquadError(artisteOut);
    }

    if (squad.artistes.map((it) => it.artiste_id).includes(artisteIn)) {
      throw new ArtisteAlreadyInSquadError(artisteIn);
    }

    const session = await startSession();
    await session.withTransaction(async () => {
      await Promise.all([
        this.model
          .updateOne(
            { _id: id },
            {
              $addToSet: {
                artistes: { artiste_id: artisteIn, is_on_stage: false }
              }
            },
            { session }
          )
          .exec(),
        this.model
          .updateOne(
            { _id: id },
            { $pull: { artistes: { artiste_id: artisteOut } } },
            { session }
          )
          .exec(),
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

    return this.getOne(id);
  }

  async substitute(id: string, artisteIn: string, artisteOut: string) {
    let [squad, artIn, artOut] = await Promise.all([
      this.byID(id),
      ArtisteRepo.byID(artisteIn),
      ArtisteRepo.byID(artisteIn)
    ]);

    if (!squad) throw new SquadNotExistsError();
    if (!artOut) throw new ArtisteNotExistsError(artisteIn);
    if (!artIn) throw new ArtisteNotExistsError(artisteOut);

    const squadArtistes = squad.artistes.map((it) => it.artiste_id);
    if (!squadArtistes.includes(artisteOut)) {
      throw new ArtisteNotInSquadError(artisteOut);
    }

    if (!squadArtistes.includes(artisteIn)) {
      throw new ArtisteNotInSquadError(artisteIn);
    }

    const session = await startSession();
    await session.withTransaction(async () => {
      await Promise.all([
        this.model
          .updateOne(
            { _id: id, 'artistes.artiste_id': artisteIn },
            { $set: { 'artistes.$.is_on_stage': true } },
            { session }
          )
          .exec(),
        this.model
          .updateOne(
            { _id: id, 'artistes.artiste_id': artisteOut },
            { $set: { 'artistes.$.is_on_stage': false } },
            { session }
          )
          .exec()
      ]);

      await session.commitTransaction();
    });
    session.endSession();

    return this.getOne(id);
  }
}
export const SquadRepo = new SquadRepository();
