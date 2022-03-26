import { BaseModel } from 'data/base';

export interface IPoint extends BaseModel {
  week: string;
  points: number;
  artiste: string;
  week_number: number;
}
