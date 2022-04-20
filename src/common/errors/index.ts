import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';

export class ControllerError extends Error {
  code: number;
  error_code: number;
  constructor(message: string, code?: number, error_code?: number) {
    super(message);
    this.code = code || 400;
    this.error_code = error_code || 0; // special error codes which clients can read and react to.
  }
}

/**
 * Generic HTTP Bad Request Error
 * Sets the HTTP status code to 400 `Bad Request` when request is not properly formatted.
 */
export class ActionNotAllowedError extends ControllerError {
  constructor(message: string) {
    super(message);
    this.code = BAD_REQUEST;
  }
}

/**
 * Generic HTTP Not Found error
 * Sets the HTTP status code to 404 `Not Found` when a queried item is not found.
 */
export class NotFoundError extends ControllerError {
  constructor(message: string) {
    super(message, NOT_FOUND);
  }
}

export class InvalidSecretKeyError extends ControllerError {
  constructor() {
    const errorMessage = `the secret key provided doesn't exist`;
    super(errorMessage);

    this.code = UNAUTHORIZED;
    this.error_code = 702;
  }
}

export class MissingAuthHeaderError extends ControllerError {
  constructor() {
    const errorMessage = `authorization header not found`;
    super(errorMessage);

    this.code = UNAUTHORIZED;
    this.error_code = 703;
  }
}

export class InvalidAuthSchemeError extends ControllerError {
  constructor() {
    const errorMessage = `invalid authentication scheme`;
    super(errorMessage);

    this.code = UNAUTHORIZED;
    this.error_code = 704;
  }
}

export class AccountNotFoundError extends ControllerError {
  constructor(id: string) {
    const errorMessage = `account with id: (${id}) does not exist`;
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 706;
  }
}

export class PinNotSetError extends ControllerError {
  constructor() {
    const errorMessage =
      'Your transaction PIN has not been set, please set it first';
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 310;
  }
}

export class AccountExistsError extends ControllerError {
  constructor() {
    const errorMessage = 'A user with matching details exists';
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 301;
  }
}

export class AccountNotExistsError extends ControllerError {
  constructor() {
    const errorMessage = 'account does not exist';
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 302;
  }
}

export class LoginAuthenticationError extends ControllerError {
  constructor() {
    const errorMessage = 'Incorrect phone number or password supplied';
    super(errorMessage);

    this.code = UNAUTHORIZED;
    this.error_code = 306;
  }
}

class RepositoryError extends ControllerError {
  constructor(message) {
    super(message);
  }
}

export class DuplicateModelError extends RepositoryError {
  constructor(message: string) {
    super(message);

    this.code = BAD_REQUEST;
    this.error_code = 11000;
  }
}

export class ModelNotFoundError extends RepositoryError {
  constructor(message: string) {
    super(message);

    this.code = NOT_FOUND;
  }
}

export class SquadNotExistsError extends ControllerError {
  constructor() {
    const errorMessage = 'squad does not exist';
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 303;
  }
}

export class PlayerSquadExistsError extends ControllerError {
  constructor() {
    const errorMessage = 'you have already created a squad';
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 305;
  }
}

export class SquadFilledError extends ControllerError {
  constructor() {
    const errorMessage = 'your squad is already complete';
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 303;
  }
}

export class SquadWillBeFilledError extends ControllerError {
  constructor() {
    const errorMessage =
      'your squad will have too many artistes, max squad size is 8';
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 304;
  }
}

export class ArtisteNotExistsError extends ControllerError {
  constructor(id: string) {
    const errorMessage = `artiste with id: (${id}) does not exist`;
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 203;
  }
}

export class ArtisteNotInSquadError extends ControllerError {
  constructor(id: string) {
    const errorMessage = `artiste with id: (${id}) is not in this squad`;
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 204;
  }
}

export class ArtisteAlreadyInSquadError extends ControllerError {
  constructor(id: string) {
    const errorMessage = `artiste with id: (${id}) is already in this squad`;
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 204;
  }
}

export class WeekNotFoundError extends ControllerError {
  constructor(week_number: number) {
    const errorMessage = `week (${week_number}) does not exist`;
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 103;
  }
}

export class ArtistesNotEnoughError extends ControllerError {
  constructor() {
    const errorMessage = `the number of artistes should be 8`;
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 205;
  }
}

export class InsufficientFundsError extends ControllerError {
  constructor() {
    const errorMessage = `you don't have enough in the bank for these artistes`;
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 401;
  }
}

export class InsufficientFundsForTransferError extends ControllerError {
  constructor() {
    const errorMessage = `you don't have enough in the bank for the transfer`;
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 402;
  }
}

export class LeagueNotExistsError extends ControllerError {
  constructor() {
    const errorMessage = 'League does not exist';
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 303;
  }
}

export class LeagueFilledError extends ControllerError {
  constructor() {
    const errorMessage = 'the league is already complete';
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 303;
  }
}
 
export class SquadAlreadyInLeagueError extends ControllerError {
  constructor(id: string) {
    const errorMessage = `squad with id: (${id}) is already in this league`;
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 204;
  }
}

export class SquadNotInLeagueError extends ControllerError {
  constructor(id: string) {
    const errorMessage = `squad with id: (${id}) is not in this league`;
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 204;
  }
}

