import {
  SchemaFactory,
  trimmedRequiredString,
  trimmedRequiredLowercaseString,
  trimmedString
} from 'data/base';
import { model } from 'mongoose';

const PlayerSchema = SchemaFactory({
  player_name: { ...trimmedRequiredString },
  email: { ...trimmedRequiredLowercaseString },
  country: { ...trimmedString }
});

module.exports = model('Player', PlayerSchema);
