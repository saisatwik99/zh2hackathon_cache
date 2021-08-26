import BaseError from './baseError.js';
import httpErrors from './constants.js';

export default class ConflictError extends BaseError {
    constructor(info, code = httpErrors.CONFLICT_ERROR) {
        super({ code, info });
    }
}
