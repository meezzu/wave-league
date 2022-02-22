import { foreignKey, requiredNumber, SchemaFactory } from '../base';
import { IPoint } from './point.model';

const PointSchema = SchemaFactory<IPoint>({
  points: { ...requiredNumber },
  week_number: { ...requiredNumber },
  artiste: foreignKey('Artiste'),
  week: foreignKey('Week')
});

export default PointSchema;
