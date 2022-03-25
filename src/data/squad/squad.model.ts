import { Document } from 'mongoose';

export interface ISquad extends Document {
  squad_name: string;
  total_points: number;
  total_rank: number;
  squad_value: number;
  in_the_bank: number;
  artistes: string[];
  player: string;
  leagues: string;
  roster: Roster[];
}

export interface Roster {
  artiste: string;
  location: 'stage' | 'bench';
}
