import { ArtisteRepo, IArtiste } from '../data/artiste';
import faker from 'faker';
import db from '../server/db';
import Omi, { OmiEvent } from '@random-guys/omi';
import { seedArtistes } from './artistes';

db.connect();

const omi = new Omi<Partial<IArtiste>>([]);

omi.on(OmiEvent.DATA, (data, key) => {
  ArtisteRepo.create(data).catch(console.log);
  console.log(key);
});

omi.on(OmiEvent.END, () => {
  console.log('Stream closed');
  process.exit(0);
});

omi.on(OmiEvent.DONE, () => {
  console.log('Stream closed');
  process.exit(0);
});

omi.on(OmiEvent.ERROR, error => {
  console.log(error);
});

omi.addMany(
  seedArtistes.map(artiste_name => {
    const name = artiste_name.replace(' ', '_');
    return {
      price: faker.random.arrayElement([5, 10, 15, 20]),
      avatar: `https://res.cloudinary.com/raymond-tukpe/image/upload/v1653068719/wave-league/${name}.png`,
      record_label: faker.random.arrayElement([
        'YBNL',
        'Mavin',
        'YMCMB',
        'Plug',
        'Chocolate City'
      ]),
      artiste_name
    };
  })
);
