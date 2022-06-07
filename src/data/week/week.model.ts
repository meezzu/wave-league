import { Document } from 'mongoose';

export interface IWeek extends Partial<Document> {
  week_number: number;
  start_date: Date;
  end_date: Date;
}
