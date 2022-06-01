import { BaseModel } from 'data/base';

export interface IScore extends BaseModel {
  week: string;
  score: number;
  squad: string;
  week_number: number;
}
