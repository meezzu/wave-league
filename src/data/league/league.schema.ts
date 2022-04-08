import {
  requiredNumber,
  SchemaFactory,
  trimmedRequiredString,
} from '../base';
import { ILeague } from './league.model';

const LeagueSchema = SchemaFactory<ILeague>({
  league_name: { ...trimmedRequiredString },
  league_type: { ...trimmedRequiredString  },
  player_limit: { ...requiredNumber, default: 100 },
  players: [
    {
     player: {
    ...trimmedRequiredString,
    ref: 'Player',
    unique: true
  }
    }
    ],
  total_players: {...requiredNumber, default: 0}
});

export default LeagueSchema;
