import { Document } from 'mongoose';

export interface ISquad extends Document {
  squad_name: string;
  total_rank: number;
  squad_value: number;
  in_the_bank: number;
  artistes: string[];
  player: string;
  leagues: string;
  roster: Roster[];

  // stats
  transfer_count: number;
  squad_ranking: number;
  total_points: number;
}

export interface Roster {
  artiste: string;
  location: 'stage' | 'bench';
}
