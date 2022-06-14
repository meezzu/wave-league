import { BaseRepository } from '../base';
import { IWeek } from './week.model';
import WeekSchema from './week.schema';

class WeekRepository extends BaseRepository<IWeek> {
  constructor() {
    super('Week', WeekSchema);
  }

  async getCurrentWeek() {
    const [week] = await WeekRepo.getModel()
      .find()
      .sort({ created_at: -1 })
      .limit(1);

    return week;
  }
}

export const WeekRepo = new WeekRepository();
