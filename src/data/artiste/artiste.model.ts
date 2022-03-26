import { BaseModel } from '../../data/base';

export interface IArtiste extends BaseModel {
  artiste_name: string;
  record_label: string;
  location?: 'stage' | 'bench';
  avatar: string;
  price: number;
}
