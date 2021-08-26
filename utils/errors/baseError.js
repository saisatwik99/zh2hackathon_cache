import httpErrors from './constants.js';

export default class BaseError extends Error {
  get HttpError() {
    return this.code;
  }

  constructor({ code = httpErrors.INTERNAL_SERVER_ERROR, info } = {}) {
    // Pass remaining arguments to parent constructor
    super(info);

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    // Custom debugging information
    this.code = code;
    this.name = code.name;
    this.info = info;
  }
}
