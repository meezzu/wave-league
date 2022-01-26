export interface IArtiste {
  artiste_name: string;
  record_label: string;
  avatar: string;
  price: number;
}

export type CreateArtisteDTO = IArtiste;
