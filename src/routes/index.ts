import { Router } from 'express';
import validator from '../server/middleware/validator';
import {
  artistesOnly,
  createArtiste,
  createLeague,
  createPoint,
  createSquad,
  createWeek,
  login,
  paginate,
  rankings,
  replaceArtistes,
  signup,
  updatePlayer,
  updateSquad
} from '../validators';
import {
  artistes,
  squads,
  players,
  transfers,
  weeks,
  points,
  charts,
  leagues,
  feedbacks,
  mocks,
  scores
} from '../server/controllers';
import gateman from '../server/gateman';

const v1Router = Router();

v1Router
  .get('/players', validator(paginate, 'query'), players.getMany)
  .get('/players/:id', gateman.guard(['user', 'admin']), players.getOne)
  .put('/players/:id', validator(updatePlayer), players.update)
  .post('/players/login', validator(login), players.login)
  .get('/players/:id/squad', gateman.guard('user'), players.getSquad)
  .post('/players/signup', validator(signup), players.signup)
  .delete('/players/:id', gateman.guard('admin'), players.delete);

v1Router
  .get(
    '/artistes',
    gateman.guard(),
    validator(paginate, 'query'),
    artistes.getMany
  )
  .post('/artistes', gateman.guard(), validator(createArtiste), artistes.create)
  .get('/artistes/:id/weeks/:wid/points', gateman.guard(), artistes.getPoints)
  .get('/artistes/:id', gateman.guard(), artistes.getOne);

v1Router
  .get('/squads', gateman.guard(), validator(paginate, 'query'), squads.getMany)
  .get('/squads/:id/weeks/:wid', squads.weekScores)
  .get('/squads/:id/transfers', gateman.guard(), squads.transfers)
  .get('/squads/:id', gateman.guard(), squads.getOne)
  .put('/squads/:id', gateman.guard(), validator(updateSquad), squads.update)
  .post('/squads', gateman.guard(), validator(createSquad), squads.create)
  .post(
    '/squads/:id/add-artistes',
    gateman.guard(),
    validator(artistesOnly),
    squads.addArtistes
  )
  .post(
    '/squads/:id/replace-artistes',
    gateman.guard(),
    validator(replaceArtistes),
    squads.replaceArtistes
  )
  .post(
    '/squads/:id/substitute',
    gateman.guard(),
    validator(replaceArtistes),
    squads.substitute
  );

v1Router
  .get('/transfers', validator(paginate, 'query'), transfers.getMany)
  .get('/transfers/top/out', transfers.getTopTransfersOut)
  .get('/transfers/top/in', transfers.getTopTransfersIn)
  .get('/transfers/:id', transfers.getOne)
  .post('/transfers', transfers.create);

v1Router
  .get('/weeks', validator(paginate, 'query'), weeks.getMany)
  .get('/weeks/current', weeks.getCurrentWeek)
  .get('/weeks/:id', weeks.getOne)
  .post('/weeks', validator(createWeek), weeks.create);

v1Router
  .get('/points', validator(paginate, 'query'), points.getMany)
  .get('/points/:id', points.getOne)
  .post('/points', validator(createPoint), points.create);

v1Router.get('/charts', validator(paginate, 'query'), charts.getMany);

v1Router.get(
  '/mocks/run-weekly-job',
  validator(paginate, 'query'),
  mocks.runWeeklyJob
);

v1Router
  .get('/leagues', validator(paginate, 'query'), leagues.getMany)
  .post('/leagues', validator(createLeague), leagues.create)
  .get('/leagues/:id', leagues.getOne)
  .get('/leagues/:id/ranking', validator(rankings, 'query'), leagues.getRanking)
  .post('/leagues/:id/join', leagues.addSquad)
  .post('/leagues/:id/leave', leagues.removeSquad);

v1Router
  .get('/feedback', validator(paginate, 'query'), feedbacks.getMany)
  .get('/feedback/:id', feedbacks.getOne)
  .post('/feedback', feedbacks.create);

v1Router.get('/scores', validator(paginate, 'query'), scores.getMany);

export default v1Router;
