import Agenda, { Job } from 'agenda';
import mongoose from 'mongoose';
import { publisher } from '@random-guys/eventbus';
import { JOB_WEEKS_CREATE } from '../common/constants';
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

  const week = lastWeek.length > 0 ? lastWeek[0].week_number : 0;

  await publisher.queue(JOB_WEEKS_CREATE, {
    week_number: week + 1
  });
});
