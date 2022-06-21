import {
  foreignKey,
  requiredNumber,
  SchemaFactory,
  trimmedLowercaseString,
  trimmedString
} from '../base';
import { IScore } from './score.model';

const ScoreSchema = SchemaFactory<IScore>({
  score: { ...requiredNumber },
  week_number: { ...requiredNumber },
  squad: foreignKey('Squad'),
  week: foreignKey('Week'),
  roster: [
    {
      points: { ...requiredNumber },
      artiste: { ...trimmedString },
      location: { ...trimmedLowercaseString }
    }
  ]
});

export default ScoreSchema;
