import { requiredNumber, SchemaFactory, trimmedRequiredString } from '../base';
import { ILeague } from './league.model';

const LeagueSchema = SchemaFactory<ILeague>({
  league_name: { ...trimmedRequiredString },
  league_type: {
    ...trimmedRequiredString,
    enum: ['public', 'private']
  },
  squad_limit: { ...requiredNumber, default: 20, max: 20 },
  squads: [
    {
      ...trimmedRequiredString,
      ref: 'Squad'
    }
  ]
});

export default LeagueSchema;
