import BaseError from './baseError.js';
import httpErrors from './constants.js';

export default class InputParamError extends BaseError {
  constructor(info, code = httpErrors.INPUT_PARAM_ERROR) {
    super({ code, info });
  }
}
