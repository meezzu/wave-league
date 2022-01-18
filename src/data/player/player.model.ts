export interface IPlayer {
  _id: string;

  player_name: string;
  email: string;
  country: string;
}

export type CreatePlayerDTO = IPlayer;
