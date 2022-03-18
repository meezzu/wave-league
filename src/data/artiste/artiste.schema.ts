import { requiredNumber, SchemaFactory, trimmedRequiredString } from '../base';
import { IArtiste } from './artiste.model';

const ArtisteSchema = SchemaFactory<IArtiste>({
  artiste_name: { ...trimmedRequiredString },
  record_label: { ...trimmedRequiredString },
  avatar: { ...trimmedRequiredString },
  price: { ...requiredNumber }
});

ArtisteSchema.index({
  deleted_at: 1,
  created_at: 1
});

ArtisteSchema.index({
  artiste_name: 1,
  record_label: 1,
  price: 1,
  deleted_at: 1
});

ArtisteSchema.index({
  artiste_name: 1,
  record_label: 1,
  price: -1,
  deleted_at: 1
});

ArtisteSchema.index({
  artiste_name: 1,
  record_label: -1,
  price: -1,
  deleted_at: 1
});

ArtisteSchema.index({
  artiste_name: -1,
  record_label: -1,
  price: -1,
  deleted_at: 1
});

ArtisteSchema.index({
  artiste_name: -1,
  record_label: -1,
  price: 1,
  deleted_at: 1
});

ArtisteSchema.index({
  artiste_name: -1,
  record_label: 1,
  price: 1,
  deleted_at: 1
});

ArtisteSchema.index({
  artiste_name: -1,
  record_label: 1,
  price: 1,
  deleted_at: 1
});

ArtisteSchema.index({
  artiste_name: 1,
  record_label: -1,
  price: -1,
  deleted_at: 1
});

export default ArtisteSchema;
