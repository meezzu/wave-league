import { requiredNumber, SchemaFactory, trimmedRequiredString } from '../base';
import { SchemaTypes } from 'mongoose';
import { ISquad } from './squad.model';

const SquadSchema = SchemaFactory<ISquad>({
  squad_name: { ...trimmedRequiredString },
  squad_value: { ...requiredNumber },
  in_the_bank: { ...requiredNumber },
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
    required: true
  }
});

export default SquadSchema;
