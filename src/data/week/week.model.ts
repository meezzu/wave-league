import { BaseModel } from 'data/base';

export interface IWeek extends Partial<BaseModel> {
  week_number: number;
  start_date: Date;
  end_date: Date;
}
