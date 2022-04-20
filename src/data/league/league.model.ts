import { BaseModel } from '../../data/base';

export interface ILeague extends BaseModel {
  league_name: string;
  league_type: 'public' | 'private';
  squad_limit?: number;
  squads: string[];
  total_players: number;
}
