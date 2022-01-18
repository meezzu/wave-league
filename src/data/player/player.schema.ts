import {
  SchemaFactory,
  trimmedRequiredString,
  trimmedRequiredLowercaseString,
  trimmedString
} from '../base';
import { IPlayer } from './player.model';

const PlayerSchema = SchemaFactory<IPlayer>({
  player_name: { ...trimmedRequiredString },
  email: { ...trimmedRequiredLowercaseString },
  country: { ...trimmedString }
});

export default PlayerSchema;
