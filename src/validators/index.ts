import joi from 'joi';

const requiredString = joi.string().trim().required();
const requiredEmail = requiredString.email();
const requiredNumber = joi.number().min(1).max(100).integer().required();

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
