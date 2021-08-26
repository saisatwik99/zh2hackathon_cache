import BaseError from './baseError.js';
import httpErrors from './constants.js';

export default class AuthError extends BaseError {
  constructor(code = httpErrors.UNAUTHORIZED, info = 'Insufficient credentials') {
    super({ code, info });
  }
}
