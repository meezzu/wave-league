import { requiredNumber, SchemaFactory, trimmedRequiredString } from '../base';
import { SchemaTypes } from 'mongoose';
import { ISquad } from './squad.model';

const SquadSchema = SchemaFactory<ISquad>({
  squad_name: { ...trimmedRequiredString },
  squad_value: { ...requiredNumber, default: 0 },
  in_the_bank: { ...requiredNumber, default: 0 },
  artistes: [
    {
      type: SchemaTypes.String,
      ref: 'Artiste',
      required: true
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
