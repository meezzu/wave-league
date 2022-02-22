import { Document } from 'mongoose';

export interface IPoint extends Document {
  week: string;
  points: number;
  artiste: string;
  week_number: number;
}
