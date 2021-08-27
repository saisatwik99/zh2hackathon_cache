import moment from 'moment';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import responder from '../utils/responseHandler.js';
import accountService from '../services/accounts.js';
import ValidationError from '../utils/errors/validationError.js';

import accountsUtil from '../utils/account.js';
import accountDb from '../db/account.js';
import userDb from '../db/user.js';

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
    const { error } = req.query;
    if (error === 'REJECTED') {
      res.render('createAccount', { user, error: 'PAN or Phone Number Already in use' });
      return;
    }
    res.render('createAccount', { user, error: '' });
    return;
  } catch (ex) {
    return next(ex);
  }
};

const getAccountDetails = async (req, res, next) => {
  try {
    const { user } = req;
    const accountDetails = await accountDb.getAccountDetails({ email: user.email });
    let exist = false;
    if (accountDetails !== undefined) {
      exist = true;
    }
    if (!exist) {
      return res.render('accounts', {
        exist
      });
    }
    const transactions = await accountService.getAccountTransactions({ email: user.email, pgSize: 50, pgNumber: 1 });
    const balance = await accountService.getAccountBalance(user.email);

    const modifiedTransactions = [];
    console.log(transactions.totalRecord);

    transactions.accountTransactionList.forEach((ele) => {
      modifiedTransactions.push({
        date: moment(ele.timestamp).format('D MMM, YY'),
        details: ele.remarks,
        amount: ele.amount,
        status: ele.recordType
      });
    });

    res.render('accounts', {
      account: {
        id: accountDetails.account.accountID,
        balance
      },
      transDetails: modifiedTransactions,
      user,
      exist
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
    if (data.status === 'REJECTED') {
      res.redirect('/api/account/createAccount?error=REJECTED');
      return;
    }
    res.redirect('/api/account/home');
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

const getTransfer = async (req, res, next) => {
  const { user } = req;
  const { error, errorMessage } = req.query;
  let newErrorMessage = '';
  let newError = false;
  if (error) newError = true;
  if (errorMessage === 'bankAccount') {
    newErrorMessage = 'Bank Account not linked with this email';
  } else if (errorMessage === 'amount') {
    newErrorMessage = 'Insuffient fund in your account';
  }
  res.render('getTransfer', { error: newError, errorMessage: newErrorMessage });
};

const postTransfer = async (req, res, next) => {
  const { user } = req;
  const { email, amount } = req.body;
  const peerDetails = await accountDb.getAccountDetails({ email });
  const userDetails = await accountDb.getAccountDetails({ email: user.email });
  if (peerDetails === undefined) {
    res.redirect('/api/account/transfer?error=true&errorMessage=bankAccount');
    return;
  }
  const peerUserDetails = await userDb.getUserDetails({ email });
  const userBalance = await accountService.getAccountBalance(user.email);
  if (amount > userBalance) {
    res.redirect('/api/account/transfer?error=true&errorMessage=amount');
    return;
  }
  const data = {
    requestID: uuidv4(),
    amount: {
      currency: 'INR',
      amount
    },
    transferCode: 'ATLAS_P2M_AUTH',
    debitAccountID: userDetails.account.accountID,
    creditAccountID: peerDetails.account.accountID,
    transferTime: 1574741608000,
    remarks: `Transfer to ${peerUserDetails.firstName}`,
    attributes: {}
  };
  const url = 'https://fusion.preprod.zeta.in/api/v1/ifi/140793/transfers';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-Zeta-AuthToken': 'eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwidGFnIjoiejhPVXlDZjNVNGZMVm4ybl9CaGJPZyIsImFsZyI6IkExMjhHQ01LVyIsIml2IjoicTNNTWFXOExQbVM5UDlMRyJ9.5mypFwHlMnsBAnWrsK9ZZN9EMpbF3T4B6ovRwDzdNzA.3zT3LxLoMDw6GcgtLMhK9Q.DQ7JpV-iGOzkmWT2mKcfu-K8lgu2j-TUckJ3SDA70s4VuRkSptUrR4VQIM7IDQSNMr3l1w_NyBvvAIVjDs_73zV377xF4dlPsLURJMhPp67VvyxRdZAdi98GtlbbsqFxEYxRxA0bdOjLNE3OaJ2SPBIfMKFQ4Fko2kus_Z4N_PXPhwROPR5WXv64FHdkwdJGXB6m1VkB0YoX00zlwEHCRn6wqoIdKk65SfJcJ8xkfKGTtdzGVoayOzyJwX5xBAm66I6XFmX734ynaXBGMPJ9RRcnkzkUn8z0aFEVLvnqjtFXZPld-oVaj7LkO5hdEfAXD2-APZTqV5qgf6EyYxry_z6CECNVQUx8Jhz6RbV7siVgW0x0knz0E-XuSVzp06SV.ylXkDfUP4RmWbHQ0urZMOw'
    },
    body: JSON.stringify(data)
  };

  const response = await fetch(url, options);
  const json = await response.json();
  res.redirect('/api/account/home');
};

const getNetWorth = async (req, res, next) => {
  try {
    const { user } = req;

    const data = await accountService.getNetWorth(user);

    return responder(res)(null, { networth: data });
  } catch (err) {
    return next(err);
  }
};

export default {
  linkAccount,
  getAccountDetails,
  getAccountTransactions,
  getCreateAccount,
  unlinkAccount,
  createAccount,
  getAccountBalance,
  getTransfer,
  postTransfer,
  getNetWorth
};
