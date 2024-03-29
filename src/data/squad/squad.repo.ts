import { xor } from 'lodash';
import { startSession } from 'mongoose';
import {
  ArtisteAlreadyInSquadError,
  ArtisteNotExistsError,
  ArtisteNotInSquadError,
  ArtistesNotEnoughError,
  InsufficientFundsError,
  InsufficientFundsForTransferError,
  SquadFilledError,
  SquadNotExistsError,
  SquadWillBeFilledError
} from '../../common/errors';
import { ArtisteRepo } from '../../data/artiste';
import { TransferRepo } from '../../data/transfer';
import { BaseRepository } from '../base';
import { ISquad } from './squad.model';
import SquadSchema from './squad.schema';

class SquadRepository extends BaseRepository<ISquad> {
  constructor() {
    super('Squad', SquadSchema);
  }

  async getOne(id: string): Promise<ISquad> {
    const squad = await this.byID(id, {
      populations: [
        { path: 'player', select: 'player_name' },
        {
          path: 'artistes',
          select: 'price avatar artiste_name record_label'
        }
      ]
    });

    if (!squad) throw new SquadNotExistsError();

    const { artistes, roster, ...rest } = squad['_doc'];

    const moddedArtistes = [];
    for (const art of artistes) {
      const x = roster.find(it => it.artiste === art['_id']);
      moddedArtistes.push({ ...art['_doc'], location: x.location });
    }

    rest['artistes'] = moddedArtistes;

    return rest as ISquad;
  }

  async addArtistes(id: string, artistes: string[]) {
    if (artistes.length != 8) throw new ArtistesNotEnoughError();

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
      artistesArray.map(it => it['_id'])
    );

    // checks if an invalid artiste id was passed
    for (const absent of absentArtistes) {
      // if one artiste is found throw and exit early
      throw new ArtisteNotExistsError(absent);
    }

    // check if the artistes we're adding are already in the squad
    for (const it of artistes) {
      if (squad.artistes.includes(it)) {
        throw new ArtisteAlreadyInSquadError(it);
      }
    }

    // check if the artistes we are adding will not exceed the squad bank
    const cost = artistesArray.reduce((acc, cur) => acc + cur.price, 0);
    const amountLeftInBank = squad.in_the_bank - cost;

    // if the cost of the artistes exceeds how much we have
    if (cost > squad.in_the_bank) {
      throw new InsufficientFundsError();
    }

    const session = await startSession();
    await session.withTransaction(async () => {
      for (const aid of artistes) {
        await this.model
          .updateOne(
            { _id: id },
            {
              $set: {
                squad_value: cost,
                in_the_bank: amountLeftInBank
              },
              $addToSet: {
                artistes: aid,
                roster: {
                  artiste: aid
                }
              }
            },
            { session, new: true }
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

    // put the last three artistes on the bench
    const ids = artistes.filter((_, i) => i > 4);

    const session2 = await startSession();
    await session2.withTransaction(async () => {
      for (const aid of ids) {
        await this.model
          .updateOne(
            { _id: id, 'roster.artiste': aid },
            { $set: { 'roster.$.location': 'bench' } },
            { session: session2 }
          )
          .exec();
      }

      session2.commitTransaction();
    });
    session2.endSession();

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
      artitesArray.map(it => it['_id'])
    );

    // checks if an invalid artiste id was passed
    for (const absent of absentArtistes) {
      // if one artiste is found throw and exit early
      throw new ArtisteNotExistsError(absent);
    }

    // check if the artistes we're removing are in the squad
    for (const it of artistes) {
      if (!squad.artistes.includes(it)) {
        throw new ArtisteNotInSquadError(it);
      }
    }

    const session = await startSession();
    await session.withTransaction(async () => {
      for (const aid of artistes) {
        await this.model
          .updateOne(
            { _id: id },
            { $pull: { artistes: aid, roster: { artiste: aid } } },
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
      ArtisteRepo.byID(artisteOut)
    ]);

    if (!squad) throw new SquadNotExistsError();
    if (!artIn) throw new ArtisteNotExistsError(artisteIn);
    if (!artOut) throw new ArtisteNotExistsError(artisteOut);

    if (!squad.artistes.includes(artisteOut)) {
      throw new ArtisteNotInSquadError(artisteOut);
    }

    if (squad.artistes.includes(artisteIn)) {
      throw new ArtisteAlreadyInSquadError(artisteIn);
    }

    // get the location of the artiste being removed
    const location = squad.roster.find(
      it => it.artiste === artisteOut
    ).location;

    const amountLeftInBank = squad.in_the_bank + artOut.price - artIn.price;
    const squadValue = squad.squad_value - artOut.price + artIn.price;
    if (amountLeftInBank < 0) {
      throw new InsufficientFundsForTransferError();
    }

    const session = await startSession();
    await session.withTransaction(async () => {
      await Promise.all([
        this.model
          .updateOne(
            { _id: id },
            {
              $set: {
                squad_value: squadValue,
                in_the_bank: amountLeftInBank
              },
              $addToSet: {
                artistes: artisteIn,
                roster: {
                  artiste: artisteIn,
                  location
                }
              }
            },
            { session }
          )
          .exec(),
        this.model
          .updateOne(
            { _id: id },
            {
              $pull: { artistes: artisteOut, roster: { artiste: artisteOut } }
            },
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
      ArtisteRepo.byID(artisteOut)
    ]);

    if (!squad) throw new SquadNotExistsError();
    if (!artIn) throw new ArtisteNotExistsError(artisteIn);
    if (!artOut) throw new ArtisteNotExistsError(artisteOut);

    const squadArtistes = squad.artistes;
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
            { _id: id, 'roster.artiste': artisteIn },
            { $set: { 'roster.$.location': 'stage' } },
            { session }
          )
          .exec(),
        this.model
          .updateOne(
            { _id: id, 'roster.artiste': artisteOut },
            { $set: { 'roster.$.location': 'bench' } },
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
