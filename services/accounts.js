import fusionApi from '../fusion/index.js';
import userDb from '../db/user.js';
import accountDb from '../db/account.js';
import ConflictError from '../utils/errors/conflictError.js';
import NotFoundError from '../utils/errors/notFoundError.js';
import goalsDb from '../db/goals.js';
import goalsUtils from '../utils/goal.js';

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

  const account = accountDetails?.accounts[0];
  const requestID = accountDetails?.requestID;
  console.log(userDetails?.email);
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

const getNetWorth = async (user) => {
  const accountData = await accountDb.getAccountDetails({ email: user?.email });
  const accountId = accountData?.account?.accountID;
  if (!accountId) {
    throw new NotFoundError('Could Not Find Account With This Email');
  }
  const accountBalance = await fusionApi.getAccountBalance(accountId);
  const goals = await goalsDb.getAllGoals(user);
  const totalGoalsValue = await goals.reduce(async (total, goal) => {
    const totalNav = goal?.totalNav;
    if (!totalNav) {
      return total + 0;
    }
    const MfAmount = await goalsUtils.getTotalNavValue(+totalNav);

    const returnValue = await total + MfAmount;

    return returnValue;
  }, 0);

  const netWorth = (+accountBalance) + (+totalGoalsValue);

  return netWorth;
};

export default {
  createAccount,
  getAccountBalance,
  getAccountTransactions,
  getNetWorth
};
