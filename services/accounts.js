import fusionApi from '../fusion/index.js';
import userDb from '../db/user.js';
import accountDb from '../db/account.js';
import ConflictError from '../utils/errors/conflictError.js';
import NotFoundError from '../utils/errors/notFoundError.js';

const createAccount = async (userDetails) => {
  const isAccountPresent = await accountDb.getAccountDetails({ email: userDetails?.email });

  if (isAccountPresent) {
    throw new ConflictError('Account Already Exists For This User');
  }

  const { status, individualID } = await fusionApi.createAccount(userDetails);
  if (status === 'REJECTED') {
    return { status: 'REJECTED' };
  }
  
  const accountDetails = await fusionApi.issueBundle({ individualID, userDetails });
  console.log(accountDetails);
  const account = accountDetails?.accounts[0];
  const requestID = accountDetails?.requestID;

  const user = await userDb.getUserDetails({ email: userDetails?.email });

  return accountDb.addAccountDetails({
    account, requestID, userRef: user?._id, email: user?.email
  });
};

const getAccountBalance = async (email) => {
  const accountData = await accountDb.getAccountDetails({ email });
  const accountId = accountData?.account?.accountID;
  if (!accountId) {
    throw new NotFoundError('Could Not Find Account With This Email');
  }
  const data = fusionApi.getAccountBalance(accountId);

  return data;
};

const getAccountTransactions = async ({ email, pgSize, pgNumber }) => {
  const accountData = await accountDb.getAccountDetails({ email });
  const accountId = accountData?.account?.accountID;
  if (!accountId) {
    throw new NotFoundError('Could Not Find Account With This Email');
  }
  const data = await fusionApi.getAccountTransactions({ accountId, pageSize: pgSize, pageNumber: pgNumber });

  return data;
};

export default {
  createAccount,
  getAccountBalance,
  getAccountTransactions
};
