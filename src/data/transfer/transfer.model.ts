import { Document } from 'mongoose';

export interface ITransfer extends Document {
  transfer_value: number;
  artiste: string;
  squad: string;
}
