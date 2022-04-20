import { BaseModel } from '../../data/base';

export interface ILeague extends BaseModel {
  _id: string;
  league_name: string;
  league_type: 'public' | 'private';
  squad_limit?: number;
  squads: string[];
  total_players: number;
}
