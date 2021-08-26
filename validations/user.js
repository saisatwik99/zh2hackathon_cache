import Joi from '@hapi/joi';

import ValidationError from '../utils/errors/validationError.js';
import InputParamError from '../utils/errors/inputParamError.js';
import httpErrors from '../utils/errors/constants.js';

const {
  LOGIN_VALIDATION_ERROR,
  SIGNUP_VALIDATION_ERROR,
  PASSWORDS_NO_MATCH_ERROR
} = httpErrors;

// eslint-disable-next-line max-len
const emailRegex = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

const password = (passField = 'password') => Joi.string()
  .min(8)
  .max(50)
  .required()
  .pattern(passRegex)
  .messages({
    'string.base': 'Something went wrong.',
    'string.pattern.base': 'Password should have an uppercase, a lowercase, a number and a special character',
    'string.min': 'password should have a minimum length of {#limit}',
    'string.max': 'password should have a maximum length of {#limit}',
    'any.required': `${passField} is required`,
    'string.empty': `${passField} is not allowed to be empty`
  });

const getAge = (birthDateString) => {
  if (!birthDateString) {
    throw new InputParamError('Date of Birth Not Found');
  }
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  // if birthday is yet to come for the current year then age should be deceased by 1
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
};

const logInSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: true }
    })
    .pattern(emailRegex)
    .required(),
  password: password()
});

const signUpSchema = Joi.object({
  firstName: Joi.string().required().min(1).max(250),
  lastName: Joi.string().min(1).max(250).optional(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: true }
  }).pattern(emailRegex).required(),
  password: password(),
  confirmPassword: password('confirmPassword'),
  dob: Joi.number().required().min(18).message('age should be greater than or equal to 18')
});

const pwdSignup = async ({ body }, res, next) => {
  try {
    if (body.password !== body.confirmPassword) {
      // return next(new ValidationError('Passwords Do Not Match', PASSWORDS_NO_MATCH_ERROR));
      return res.render('signup', { error: 'Passwords Do Not Match', errorExist: true });
    }
    return next();
  } catch (err) {
    // return next(new ValidationError(err.details));
    return res.render('signup', { error: 'Something went wrong', errorExist: true });
  }
};

const signUpValidate = ({ body }, res, next) => signUpSchema.validateAsync({
  ...body,
  password: body.password,
  confirmPassword: body.confirmPassword,
  dob: getAge(body.dob)
})
  .then(() => next())
  .catch((err) => res.render('signup', { error: err.details[0].message, errorExist: true }));
  // .catch((err) => next(new ValidationError(err.details, SIGNUP_VALIDATION_ERROR)));

const loginValidate = ({ body }, res, next) => logInSchema.validateAsync({
  ...body,
  password: body.password
})
  .then(() => next())
  .catch((err) => res.render('login', { error: err.details[0].message, errorExist: true }));
// next(new ValidationError(err.details[0].message, LOGIN_VALIDATION_ERROR))
export default {
  signUpValidate,
  pwdSignup,
  loginValidate
};
