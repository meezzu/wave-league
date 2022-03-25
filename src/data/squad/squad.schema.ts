import {
  requiredNumber,
  SchemaFactory,
  trimmedLowercaseString,
  trimmedRequiredString,
  trimmedString
} from '../base';
import { ISquad } from './squad.model';

const SquadSchema = SchemaFactory<ISquad>({
  squad_name: { ...trimmedRequiredString },
  squad_value: { ...requiredNumber, default: 0 },
  in_the_bank: { ...requiredNumber, default: 0 },
  artistes: [
    {
      ...trimmedRequiredString,
      ref: 'Artiste'
    }
  ],
  roster: [
    {
      artiste: { ...trimmedString },
      location: {
        ...trimmedLowercaseString,
        enum: ['stage', 'bench'],
        default: 'stage'
      }
    }
  ],
  player: {
    ...trimmedRequiredString,
    ref: 'Player',
    unique: true
  }
});

export default SquadSchema;
