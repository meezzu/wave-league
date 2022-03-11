import joi from 'joi';

const optionalString = joi.string().trim();
const requiredString = optionalString.required();
const requiredEmail = requiredString.email();
const optionalNumber = joi.number().min(1).integer();
const requiredNumber = optionalNumber.max(100).required();
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

export const paginate = joi.object({
  q: optionalString.allow('', null),
  page: optionalNumber.default(1),
  per_page: optionalNumber.default(20)
});
