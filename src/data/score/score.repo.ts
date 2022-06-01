import { BaseRepository } from '../base';
import { IScore } from './score.model';
import ScoreSchema from './score.schema';

class ScoreRepository extends BaseRepository<IScore> {
  constructor() {
    super('Score', ScoreSchema);
  }
}

export const ScoreRepo = new ScoreRepository();
