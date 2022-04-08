import { BaseModel } from '../../data/base';

export interface ILeague extends BaseModel {
  league_name: string;
  league_type: 'public' | 'private';
  player_limit?: number;
  players: string[];
  total_players: number;
}
