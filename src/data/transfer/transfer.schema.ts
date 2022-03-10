import { requiredNumber, SchemaFactory } from '../base';
import { SchemaTypes } from 'mongoose';
import { ITransfer } from './transfer.model';

const TransferSchema = SchemaFactory<ITransfer>({
  transfer_value: { ...requiredNumber },
  artiste: {
    type: SchemaTypes.String,
    ref: 'Artiste',
    required: true
  },
  squad: {
    type: SchemaTypes.String,
    ref: 'Squad',
    required: true
  }
});

export default TransferSchema;
