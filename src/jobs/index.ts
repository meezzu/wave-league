import Agenda, { Job } from 'agenda';
import mongoose from 'mongoose';
import { publisher } from '@random-guys/eventbus';
import {
  JOB_AGGREGATE_PLAYER_STATS,
  JOB_POINTS_ASSIGN,
  JOB_WEEKS_CREATE
} from '../common/constants';
import { ArtisteRepo } from '../data/artiste';
import { WeekRepo } from '../data/week';
import { SquadRepo } from 'data/squad';

export const REMINDER_JOB = 'DAILY_REMINDER_JOB';

export const jobRunner = new Agenda({
  //@ts-ignore
  mongo: mongoose.connection,
  processEvery: '1d'
});

jobRunner.define(JOB_WEEKS_CREATE, async function name(job: Job) {
  const lastWeek = await WeekRepo.getModel()
    .find()
    .sort({ created_at: -1 })
    .limit(1);

  const week = lastWeek.length > 0 ? lastWeek[0].week_number : 0;

  await publisher.queue(JOB_WEEKS_CREATE, {
    week_number: week + 1
  });
});

jobRunner.define(JOB_POINTS_ASSIGN, async function name(job: Job) {
  const lastWeek = await WeekRepo.getModel()
    .find()
    .sort({ created_at: -1 })
    .limit(1);

  const week = lastWeek.length > 0 ? lastWeek[0].week_number : 0;

  const artistes = ArtisteRepo.getModel().find().lean().cursor();
  await artistes.eachAsync(doc =>
    publisher.queue(JOB_POINTS_ASSIGN, {
      week_number: week + 1,
      artiste: doc._id
    })
  );
});

jobRunner.define(JOB_AGGREGATE_PLAYER_STATS, async function name(job: Job) {
  const squads = SquadRepo.getModel().find().lean().cursor();
  await squads.eachAsync(doc =>
    publisher.queue(JOB_AGGREGATE_PLAYER_STATS, { squad_id: doc._id })
  );
});
