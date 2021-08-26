import BaseError from './baseError.js';
import httpErrors from './constants.js';

export default class InternalServerError extends BaseError {
    constructor(info, code = httpErrors.INTERNAL_SERVER_ERROR) {
        super({ code, info });
    }
}
