import { Router } from 'express';
import { artistes } from '../server/controllers/artiste.controller';
import { squads } from '../server/controllers/squad.contoller';
import { players } from '../server/controllers/player.controller';

const v1Router = Router();

v1Router.get('/players', players.getPlayers);
// v1Router.post('/players/login', gateman.guard(), users.login);
v1Router.post('/players/signup', players.createPlayer);
v1Router.get('/players/:id', players.getOnePlayer);
v1Router.delete('/players/:id', players.deleteOnePlayer);
v1Router.delete('/players', players.deleteManyPlayers);
v1Router.put('/players/:id', players.updatePlayer);
v1Router.post('/artistes', artistes.createArtiste);
v1Router.put('/artistes/:id', artistes.updateArtiste);
v1Router.post('/squads', squads.createSquad);
v1Router.put('/squads/:id', squads.updateSquadDetails);

export default v1Router;
