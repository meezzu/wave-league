import { BaseRepository } from '../base';
import { ArtisteRepo } from '../../data/artiste';
import { ITransfer } from './transfer.model';
import TransferSchema from './transfer.schema';

class TransferRepository extends BaseRepository<ITransfer> {
  constructor() {
    super('Transfer', TransferSchema);
  }

  async transferOut(transfer_type: string = 'out') {
    const cursor = this.model.find({ transfer_type }).cursor();
    const transfers: ITransfer[] = [];
​
    await cursor.eachAsync((doc: ITransfer) => {
      transfers.push(doc);
    });
    
    const count = {};
    for (const element of transfers) {
      if (count[element.artiste]) {
        count[element.artiste] += 1;
      } else {
        count[element.artiste] = 1;
      }
    }
​
    const ids = Object.keys(count);
    const artistes = await ArtisteRepo.get({
      query: { _id: { $in: ids } }
    });
​
    let results = artistes.map(artiste => {
      const result = {
        artiste_name: artiste.artiste_name,
        avatar: artiste.avatar,
        transfer_count: count[artiste._id]
      };
​
      return result;
    });

    return results.sort((a,b) => b.transfer_count - a.transfer_count)
  }
}

export const TransferRepo = new TransferRepository();
