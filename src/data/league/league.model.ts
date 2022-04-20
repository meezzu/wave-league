import { BaseModel } from '../../data/base';

export interface ILeague extends BaseModel {
  _id: string;
  squads: string[];
  league_name: string;
  squad_limit: number;
  league_type: 'public' | 'private';
}
