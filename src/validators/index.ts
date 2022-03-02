import joi from 'joi';

const requiredString = joi.string().trim().required();
const requiredEmail = requiredString.email();
const requiredNumber = joi.number().min(1).max(100).integer().required();
const requiredDate = joi.date().required();

export const signup = joi.object({
  email: requiredEmail,
  player_name: requiredString
});

export const login = joi.object({
  email: requiredEmail
});

export const createArtiste = joi.object({
  price: requiredNumber,
  avatar: requiredString,
  record_label: requiredString,
  artiste_name: requiredString
});

export const createSquad = joi.object({
  player: requiredString,
  squad_name: requiredString
});

export const updateSquad = joi.object({
  squad_name: requiredString
});

export const createWeek = joi.object({
  week_number: requiredNumber,
  start_date: requiredDate,
  end_date: requiredDate
});

export const createPoint = joi.object({
  week_number: requiredNumber,
  artiste: requiredString,
  points: requiredNumber,
  week: requiredString
});
