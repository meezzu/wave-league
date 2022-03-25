import { ArtisteRepo, IArtiste } from '../data/artiste';
import faker from 'faker';
import db from '../server/db';
import Omi, { OmiEvent } from '@random-guys/omi';

db.connect();

const omi = new Omi<IArtiste>([]);

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

omi.on(OmiEvent.ERROR, (error) => {
  console.log(error);
});

for (let index = 0; index < 100; index++) {
  omi.addMany(
    [...Array.from({ length: 100 })].map(() => {
      return {
        is_on_stage: false,
        price: faker.random.number({ min: 50, max: 100 }),
        avatar: faker.image.people(),
        record_label: faker.random.arrayElement([
          'YBNL',
          'Mavin',
          'YMCMB',
          'Plug',
          'Chocolate City'
        ]),
        artiste_name: faker.name.findName()
      };
    })
  );
}
