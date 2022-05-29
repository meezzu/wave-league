import {
  SchemaFactory,
  trimmedRequiredString,
  trimmedRequiredLowercaseString,
  trimmedString,
  requiredNumber
} from '../base';
import { IPlayer } from './player.model';

const PlayerSchema = SchemaFactory<IPlayer>({
  player_name: { ...trimmedRequiredString },
  email: { ...trimmedRequiredLowercaseString },
  country: { ...trimmedString },

  transfer_count: { ...requiredNumber, default: 0 },
  squad_ranking: { ...requiredNumber, default: 0 },
  total_points: { ...requiredNumber, default: 0 }
});

export default PlayerSchema;
