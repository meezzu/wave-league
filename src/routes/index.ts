import { Router } from 'express';
import { artistes } from 'server/controllers/artiste.controller';
import { squads } from 'server/controllers/squad.controller';
import gateman from 'server/gateman';
import { players } from '../server/controllers/player.controller';

const v1Router = Router();

v1Router
  .get('/players', players.getPlayers)
  .get('/players/:id', players.getOnePlayer)
  .put('/players/:id', players.updatePlayer)
  .post('/players/login', players.authPlayer)
  .post('/players/signup', players.createPlayer)
  .delete('/players/:id', players.deleteOnePlayer);

v1Router
  .get('/artistes', gateman.guard(), artistes.getArtistes)
  .get('/artistes/:id', gateman.guard(), artistes.getOneArtiste);

v1Router
  .get('/squads', gateman.guard(), squads.getSquads)
  .post('/squads', gateman.guard(), squads.createSquad)
  .get('/squads/:id', gateman.guard(), squads.getOneSquad)
  .put('/squads/:id', gateman.guard(), squads.updateSquad)
  .put('/squads/:id/add', gateman.guard(), squads.addArtiste)
  .put('/squads/:id/remove', gateman.guard(), squads.removeArtiste);

export default v1Router;
