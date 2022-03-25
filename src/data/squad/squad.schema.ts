import {
  requiredNumber,
  SchemaFactory,
  trimmedRequiredLowercaseString,
  trimmedRequiredString
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
  roster: {
    artiste: { ...trimmedRequiredString },
    location: { ...trimmedRequiredLowercaseString, enum: ['stage', 'bench'] }
  },
  player: {
    ...trimmedRequiredString,
    ref: 'Player',
    unique: true
  }
});

export default SquadSchema;
