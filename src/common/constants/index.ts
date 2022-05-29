export const JOB_WEEKS_CREATE = 'job.weeks.create';
export const JOB_POINTS_ASSIGN = 'job.points.assign';
export const JOB_AGGREGATE_PLAYER_STATS = 'job.aggregate.player.stats';

// The smallest unit of time in NodeJs is 1ms
export const Millisecond = 1;
export const Second = 1000 * Millisecond;
export const Minute = 60 * Second;
export const Hour = 60 * Minute;
export const Day = 24 * Hour;
export const Week = 7 * Day;

// cron definitions
export const CRON_DAILY_MIDNIGHT_UTC = '0 0 * * *';
export const CRON_DAILY_1_AM_UTC = '0 1 * * *';

export const CRON_WEEKLY_MIDNIGHT_UTC = '0 0 * * 0';
export const CRON_WEEKLY_1_AM_UTC = '0 1 * * 0';
