import Agenda, { Job } from 'agenda';
import mongoose from 'mongoose';
import { publisher } from '@random-guys/eventbus';
import {
  JOB_POINTS_ASSIGN,
  JOB_WEEKS_CREATE,
  QUEUE_POINTS_ASSIGN,
  QUEUE_WEEKS_CREATE
} from '../common/constants';
import { ArtisteRepo } from '../data/artiste';
import { WeekRepo } from '../data/week';

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
  await publisher.queue(QUEUE_WEEKS_CREATE, {
    week_number: lastWeek[0].week_number + 1
  });
});

jobRunner.define(JOB_POINTS_ASSIGN, async function name(job: Job) {
  const lastWeek = await WeekRepo.getModel()
    .find()
    .sort({ created_at: -1 })
    .limit(1);

  const cursor = ArtisteRepo.getModel().find().lean().cursor();
  await cursor.eachAsync(async (doc) => {
    await publisher.queue(QUEUE_POINTS_ASSIGN, {
      week_number: lastWeek[0].week_number + 1,
      artiste: doc._id
    });
  });
});
