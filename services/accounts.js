import fusionApi from '../fusion/index.js';
import userDb from '../db/user.js';
import accountDb from '../db/account.js';

const createAccount = async (userDetails) => {
  const individualID = await fusionApi.createAccount(userDetails);

  const accountDetails = await fusionApi.issueBundle({ individualID, userDetails });

  const user = await userDb.getUserDetails({ email: userDetails?.email });

  return accountDb.addAccountDetails({ ...accountDetails, userRef: user?._id, email: user?.email });
};

export default {
  createAccount
};
