import { Router } from 'express';
import { players } from '../server/controllers/player.controller';

const v1Router = Router();

v1Router.get('/players', players.getPlayers);
// v1Router.post('/players/login', gateman.guard(), users.login);
v1Router.post('/players/signup', players.createPlayer);

export default v1Router;
