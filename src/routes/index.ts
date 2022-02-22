import { Router } from 'express';
import validator from '../server/middleware/validator';
import { createArtiste, createSquad, login, signup } from '../validators';
import { artistes, squads, players, transfers } from '../server/controllers';
import gateman from '../server/gateman';

const v1Router = Router();

v1Router
  .get('/players', players.getMany)
  .get('/players/:id', gateman.guard(['user', 'admin']), players.getOne)
  .put('/players/:id', players.update)
  .post('/players/login', validator(login), players.login)
  .post('/players/signup', validator(signup), players.signup)
  .delete('/players/:id', gateman.guard('admin'), players.delete);

v1Router
  .get('/artistes', gateman.guard(), artistes.getMany)
  .post('/artistes', gateman.guard(), validator(createArtiste), artistes.create)
  .get('/artistes/:id/weeks/:wid/points', gateman.guard(), artistes.getPoints)
  .get('/artistes/:id', gateman.guard(), artistes.getOne);

v1Router
  .get('/squads', gateman.guard(), squads.getMany)
  .post('/squads', gateman.guard(), validator(createSquad), squads.create)
  .get('/squads/:id', gateman.guard(), squads.getOne)
  .put('/squads/:id', gateman.guard(), squads.update)
  .get('/squads/:id/transfers', gateman.guard(), squads.transfers)
  .get(
    '/squads/:id/weeks/:wid/transfers',
    gateman.guard(),
    squads.weekTransfers
  )
  .post('/squads/:id/artiste/:aid/add', gateman.guard(), squads.addArtiste)
  .post(
    '/squads/:id/artiste/:aid/remove',
    gateman.guard(),
    squads.removeArtiste
  );

v1Router
  .get('/transfers', gateman.guard('admin'), transfers.getMany)
  .get('/transfers/:id', gateman.guard('admin'), transfers.getOne)
  .post('/transfers', gateman.guard(), transfers.createTransfer);

export default v1Router;
