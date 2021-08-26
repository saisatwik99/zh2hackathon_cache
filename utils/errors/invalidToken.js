import baseError from './baseError.js';
import httpErrors from './constants.js';

export default class InvalidJwtError extends baseError {
  constructor(info = 'Insufficient credentials') {
    super({ code: httpErrors.INVALID_JWT_TOKEN, info });
  }
}
