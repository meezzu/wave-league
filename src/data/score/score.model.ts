import { BaseModel } from 'data/base';

export interface IScore extends Partial<BaseModel> {
  week: string;
  score: number;
  squad: string;
  roster: Roster[];
  week_number: number;
}

export interface Roster {
  points: number;
  artiste: string;
  location: 'stage' | 'bench';
}
