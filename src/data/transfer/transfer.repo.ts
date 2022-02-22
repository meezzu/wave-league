import { BaseRepository } from '../base';
import { ITransfer } from './transfer.model';
import TransferSchema from './transfer.schema';

class TransferRepository extends BaseRepository<ITransfer> {
  constructor() {
    super('Transfer', TransferSchema);
  }
}
export const TransferRepo = new TransferRepository();
