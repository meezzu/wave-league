import {
  requiredNumber,
  SchemaFactory,
  trimmedRequiredString,
  requiredBoolean
} from '../base';
import { SchemaTypes } from 'mongoose';
import { ISquad } from './squad.model';

const SquadSchema = SchemaFactory<ISquad>({
  squad_name: { ...trimmedRequiredString },
  squad_value: { ...requiredNumber, default: 0 },
  in_the_bank: { ...requiredNumber, default: 0 },
  artistes: [
    {
      artiste: {
        type: SchemaTypes.String,
        ref: 'Artiste',
        required: true
      },
      is_on_stage: { ...requiredBoolean, default: false }
    }
  ],
  player: {
    type: SchemaTypes.String,
    ref: 'Player',
    unique: true,
    required: true
  }
});

export default SquadSchema;
