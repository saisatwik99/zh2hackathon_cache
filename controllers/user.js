import moment from 'moment';
import responder from '../utils/responseHandler.js';
import userService from '../services/user.js';
import ValidationError from '../utils/errors/validationError.js';
import httpErrors from '../utils/errors/constants.js';
import utils from '../utils/utils.js';
import InvalidJwtError from '../utils/errors/invalidToken.js';
import userDB from '../db/user.js';
import accountDb from '../db/account.js';

const getSignup = (req, res) => res.render('signup', { error: null, errorExist: false });

const userSignUp = async (req, res, next) => {
  try {
    const {
      body: {
        firstName, lastName, email, password, dob, confirmPassword
      }
    } = req;
    if (password !== confirmPassword) {
      // return next(new ValidationError(httpErrors.SIGNUP_VALIDATION_ERROR));
      return res.render('signup', { error: 'Passwords Do Not Match', errorExist: true });
    }
    const info = await userService.userSignUp({
      firstName, lastName, email, password, dob
    });
    if (info.token !== null) {
      req.session.authtoken = info.token;
      return res.redirect('/api/user/dashboard');
    }
    return res.render('signup', { error: info.error, errorExist: true });
  } catch (ex) {
    return next(ex);
  }
};

const getLogin = (req, res) => {
  res.render('login', { error: null, errorExist: false });
};

const userLogin = async (req, res, next) => {
  try {
    const {
      body: {
        email, password
      }
    } = req;
    const info = await userService.userLogin({ email, password });
    if (info.token !== null) {
      req.session.authtoken = info.token;
      res.redirect('/api/user/dashboard');
    } else {
      res.render('login', { error: info.error, errorExist: true });
    }
  } catch (ex) {
    return next(ex);
  }
};

const dashboard = async (req, res) => {
  const { user } = req;
  const userDetails = await userDB.getUserDetails({ email: user.email });
  const transactions = await accountDb.getAllTransactions({ email: user.email });
  let modifiedTransactions = transactions;
  if (transactions.length > 0) {
    modifiedTransactions.forEach((ele) => {
      ele.date = moment(ele.date).format('D MMM, YY');
      if (ele.amount < 0) {
        ele.status = 'Debit';
        ele.amount *= (-1);
      } else {
        ele.status = 'Credit';
      }
    });
    modifiedTransactions = modifiedTransactions.slice(0, 5);
  }

  const isThere = transactions.length > 0;
  res.render('dashboard', { user: userDetails, transactions: modifiedTransactions, isThere });
};

const billPayments = (req, res) => {
  res.render('billPayments');
};

const accounts = (req, res) => {
  res.render('accounts');
};

const billMobile = (req, res) => {
  res.render('mobile');
};

const isTokenValid = async (req, res, next) => {
  try {
    const decoded = utils.isTokenValid(req, res, next);
    return responder(res)(null, { valid: true, tokenData: decoded });
  } catch (error) {
    return next(new InvalidJwtError('INVALID TOKEN'));
  }
};

const logout = async (req, res, next) => {
  try {
    return req.session.destroy((err) => {
      console.error('error while destroying session', err);
      res.redirect('/api/user/login');
    });
  } catch (ex) {
    return next(ex);
  }
};

export default {
  getSignup,
  userSignUp,
  userLogin,
  getLogin,
  dashboard,
  billPayments,
  billMobile,
  accounts,
  isTokenValid,
  logout
};
