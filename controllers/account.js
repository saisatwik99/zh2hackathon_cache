import moment from 'moment';
import responder from '../utils/responseHandler.js';
import accountService from '../services/accounts.js';
import ValidationError from '../utils/errors/validationError.js';

import accountsUtil from '../utils/account.js';
import accountDb from '../db/account.js';

const bankLogos = {
  // eslint-disable-next-line max-len
  'State Bank of India': 'https://res.cloudinary.com/dpyeb9ref/image/upload/c_scale,h_512,w_512/v1628488080/Bank%20Logos/sbi_ipkoqe.png',
  'HDFC Bank': 'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628488080/Bank%20Logos/hdfc_o83sph.png',
  'Kotak Mahindra': 'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628488081/Bank%20Logos/209_s7kpfu.png',
  'Axis Bank': 'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628488081/Bank%20Logos/axis_cdqlds.png',
  'ICICI Bank': 'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628488080/Bank%20Logos/icici_geued2.png'
};

const linkAccount = async (req, res, next) => {
  try {
    const {
      body: {
        bankName, userName, password
      }
    } = req;
    const { user } = req;
    const accountDetails = accountsUtil.generateBankAccount({
      bankName, userName, password, userId: user._id, email: user.email, imgUrl: bankLogos[bankName]
    });
    const transactions = accountsUtil.generateTransactions({
      email: accountDetails.uniqueUserId,
      accountId: accountDetails.id,
      no: 8,
      balance: accountDetails.balance,
      fromDate: '1/1/2021',
      toDate: '6/1/2021'
    });

    await accountDb.addAccount(accountDetails);
    await accountDb.updateAccountBalance({ email: accountDetails.email, balance: transactions.closeBalance });
    await accountDb.addTransactions(transactions);

    const updatedAccountDetails = await accountDb.getAccountDetails({ email: user.email });
    res.redirect('/api/account/home');
  } catch (ex) {
    return next(ex);
  }
};

const getCreateAccount = async (req, res, next) => {
  try {
    const { user } = req;
    return res.render('createAccount', { user });
  } catch (ex) {
    return next(ex);
  }
};

const getAccountDetails = async (req, res, next) => {
  try {
    const { user } = req;
    const accountDetails = await accountDb.getAccountDetails({ email: user.email });
    const transactions = await accountDb.getAllTransactions({ email: user.email });

    let exist = false;
    if (accountDetails !== undefined) {
      exist = true;
    }
    const modifiedTransactions = transactions;
    modifiedTransactions.forEach((ele) => {
      ele.date = moment(ele.date).format('D MMM, YY');
      if (ele.amount < 0) {
        ele.status = 'Debit';
        ele.amount *= (-1);
      } else {
        ele.status = 'Credit';
      }
    });
    res.render('accounts', {
      account: accountDetails, transDetails: modifiedTransactions, user, exist
    });
  } catch (ex) {
    return next(ex);
  }
};

const getAccountTransactions = async (req, res, next) => {
  try {
    const { body: { email, pgSize, pgNumber } } = req;
    const transactions = await accountService.getAccountTransactions({ email, pgSize, pgNumber });

    return responder(res)(null, transactions);
  } catch (ex) {
    return next(ex);
  }
};

const sync = async (req, res, next) => {
  try {
    const { user } = req;
    const accountDetails = await accountDb.getAccountDetails({ email: user.email });
    const transactions = accountsUtil.generateTransactions({
      email: accountDetails.uniqueUserId,
      accountId: accountDetails.id,
      no: 4,
      balance: accountDetails.balance,
      fromDate: '6/2/2021',
      toDate: '8/2/2021'
    });

    await accountDb.updateAccountBalance({ email: accountDetails.email, balance: transactions.closeBalance });
    await accountDb.addTransactions(transactions);

    const updatedTransactions = await accountDb.getAllTransactions({ email: user.email });
    return responder(res)(null, { transactions: updatedTransactions, numOfTransactions: updatedTransactions.length });
  } catch (ex) {
    return next(ex);
  }
};

const unlinkAccount = async (req, res, next) => {
  const { user } = req;
  await accountDb.deleteAccount(user.email);
  await accountDb.deleteTransactions(user.email);
  res.redirect('/api/account/home');
};

const createAccount = async (req, res, next) => {
  try {
    const {
      body: {
        salutation,
        firstName,
        lastName,
        middleName,
        dob,
        gender,
        mothersName,
        panNumber,
        mobileNumber,
        email
      }
    } = req;

    if (
      !salutation
      || !firstName
      || !lastName
      || !middleName
      || !dob
      || !gender
      || !mothersName
      || !panNumber
      || !mobileNumber
      || !email) {
      return next(new ValidationError('Missing Parameters'));
    }

    const [day, month, year] = dob.split('/');

    const data = await accountService.createAccount({
      firstName,
      middleName,
      lastName,
      salutation,
      dob: { day, month, year },
      gender,
      mothersName,
      panNumber,
      mobileNumber,
      email
    });

    return responder(res)(null, data);
  } catch (err) {
    return next(err);
  }
};

const getAccountBalance = async (req, res, next) => {
  try {
    const { body: { email } } = req;

    const balance = await accountService.getAccountBalance(email);

    return responder(res)(null, { balance });
  } catch (err) {
    return next(err);
  }
};

export default {
  linkAccount,
  getAccountDetails,
  getAccountTransactions,
  sync,
  getCreateAccount,
  unlinkAccount,
  createAccount,
  getAccountBalance
};
