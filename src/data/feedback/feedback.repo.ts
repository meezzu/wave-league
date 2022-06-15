import { BaseRepository } from '../base';
import { IFeedback } from './feedback.model';
import FeedbackSchema from './feedback.schema';

class FeedbackRepository extends BaseRepository<IFeedback> {
  constructor() {
    super('Feedback', FeedbackSchema);
  }
}

export const FeedbackRepo = new FeedbackRepository();
