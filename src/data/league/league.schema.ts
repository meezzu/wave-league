import { requiredNumber, SchemaFactory, trimmedRequiredString } from '../base';
import { ILeague } from './league.model';

const LeagueSchema = SchemaFactory<ILeague>({
  league_name: { ...trimmedRequiredString },
  league_type: {
    ...trimmedRequiredString,
    enum: ['public', 'private']
  },
  player_limit: { ...requiredNumber, default: 20, max: 20 },
  players: [
    {
      player: {
        ...trimmedRequiredString,
        ref: 'Player',
        unique: true
      }
    }
  ]
});

export default LeagueSchema;
