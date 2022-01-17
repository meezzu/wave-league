import { requiredNumber, SchemaFactory, trimmedRequiredString } from 'data/base';
import { IArtiste } from './artiste.model';

const ArtisteSchema = SchemaFactory<IArtiste>({
  artiste_name: { ...trimmedRequiredString },
  record_label: { ...trimmedRequiredString },
  avatar: { ...trimmedRequiredString },
  price: { ...requiredNumber }
});

export default ArtisteSchema;
