import { foreignKey, requiredNumber, SchemaFactory } from '../base';
import { IScore } from './score.model';

const ScoreSchema = SchemaFactory<IScore>({
  score: { ...requiredNumber },
  week_number: { ...requiredNumber },
  squad: foreignKey('Squad'),
  week: foreignKey('Week')
});

export default ScoreSchema;
