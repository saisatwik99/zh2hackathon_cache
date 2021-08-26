import BaseError from './baseError.js';
import httpErrors from './constants.js';

export default class NotFoundError extends BaseError {
  constructor(info, code = httpErrors.NOT_FOUND) {
    super({ code, info });
  }
}
