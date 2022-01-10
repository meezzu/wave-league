import users from '../server/controllers/user.controller';
import gateman from '../server/gateman';
import { Router } from 'express';

const v1Router = Router();

v1Router.get('/players', gateman.guard(), users.getUser);
v1Router.post('/players/login', gateman.guard(), users.login);
v1Router.post('/players/signup', users.signup);

export default v1Router;
