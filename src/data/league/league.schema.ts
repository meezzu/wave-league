import {
  requiredNumber,
  SchemaFactory,
  trimmedRequiredString,
  uuid
} from '../base';
import { ILeague } from './league.model';

const LeagueSchema = SchemaFactory<ILeague>({
  _id: { ...uuid, required: true, default: 'general' },
  league_name: { ...trimmedRequiredString },
  league_type: {
    ...trimmedRequiredString,
    enum: ['public', 'private']
  },
  squad_limit: { ...requiredNumber, default: 10, max: 100 },
  squads: [
    {
      ...trimmedRequiredString,
      ref: 'Squad'
    }
  ]
});

export default LeagueSchema;
