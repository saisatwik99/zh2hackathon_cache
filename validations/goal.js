import Joi from '@hapi/joi';
import httpErrors from '../utils/errors/constants.js';
import ValidationError from '../utils/errors/validationError.js';

const { VALIDATION_ERROR }= httpErrors;
const goalSchema= Joi.object({
    name: Joi.string().required(),
    description: Joi.string().min(10).max(250).optional(),
    timePeriod: Joi.number().required().min(1).max(100),
    targetAmount: Joi.number().required()
});

const goalValidate = ({ body }, res, next) => goalSchema.validateAsync({
    ...body
})
.then(() =>{
    next();
})
.catch((err) => next(new ValidationError(err.details[0].message,VALIDATION_ERROR)));

export default goalValidate;
