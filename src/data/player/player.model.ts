export interface IPlayer {
  _id: string;

  player_name: string;
  email: string;
  country: string;

  transfer_count: number;
  squad_ranking: number;
  total_points: number;
}

export type CreatePlayerDTO = IPlayer;
