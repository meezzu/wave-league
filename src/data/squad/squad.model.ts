import { Document } from 'mongoose';

export interface ISquad extends Document {
  squad_name: string;
  total_points: number;
  total_rank: number;
  squad_value: number;
  in_the_bank: number;
  artistes: OnStageArtiste[];
  player: string;
  leagues: string;
}

export interface OnStageArtiste {
  artiste_id: string;
  is_on_stage: boolean;
}
