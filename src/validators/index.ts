import joi from 'joi';

const optionalString = joi.string().trim();
const requiredString = optionalString.required();
const requiredEmail = requiredString.email();
const optionalNumber = joi.number().min(1).integer();
const requiredNumber = optionalNumber.required();
const requiredDate = joi.date().required();

export const signup = joi.object({
  email: requiredEmail,
  player_name: requiredString
});

export const updatePlayer = joi.object({
  player_name: requiredString
});

export const login = joi.object({
  email: requiredEmail
});

export const createArtiste = joi.object({
  price: requiredNumber.max(20).multiple(5),
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

export const artistesOnly = joi.object({
  artistes: joi.array().items(requiredString).required()
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
  name: optionalString.allow('', null),
  label: optionalString.allow('', null),
  sort: optionalString.allow('', null),
  squad: optionalString.allow('', null),
  max_price: optionalNumber,
  min_price: optionalNumber,
  week: optionalNumber,
  page: optionalNumber.default(1),
  per_page: optionalNumber.default(20)
});

export const replaceArtistes = joi.object({
  in: requiredString,
  out: requiredString
});

export const rankings = joi.object({
  week: optionalNumber
});

export const createLeague = joi.object({
  league_name: requiredString,
  squad_limit: requiredNumber,
  league_type: requiredString.allow('public', 'private')
});
