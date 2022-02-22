import { BaseRepository } from '../base';
import { IWeek } from './week.model';
import WeekSchema from './week.schema';

class WeekRepository extends BaseRepository<IWeek> {
  constructor() {
    super('Week', WeekSchema);
  }
}

export const WeekRepo = new WeekRepository();
