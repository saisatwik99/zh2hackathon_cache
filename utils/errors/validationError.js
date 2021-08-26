import BaseError from './baseError.js';
import httpErrors from './constants.js';

export default class ValidationError extends BaseError {
  constructor(info, code = httpErrors.VALIDATION_ERROR) {
    super({ code, info });
  }
}
