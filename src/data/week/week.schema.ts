import { requiredDate, requiredNumber, SchemaFactory } from '../base';
import { IWeek } from './week.model';

const WeekSchema = SchemaFactory<IWeek>({
  week_number: { ...requiredNumber },
  start_date: { ...requiredDate },
  end_date: { ...requiredDate }
});

export default WeekSchema;
