import { Document } from 'mongoose';

export interface ITransfer extends Document {
  transfer_value: number;
  transfer_type: string;
  artiste: string;
  squad: string;
}
