import { BaseRepository } from '../base';

import { CreateArtisteDTO, IArtiste } from './artiste.model';
import ArtisteSchema from './artiste.schema';

class ArtisteRepository extends BaseRepository<IArtiste> {
  constructor() {
    super('Artiste', ArtisteSchema);
  }

  createArtiste(body: CreateArtisteDTO) {
    return this.create(body);
  }
}
export const ArtisteRepo = new ArtisteRepository();
