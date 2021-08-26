import db from './db.js';
import ConflictError from '../utils/errors/conflictError.js';

const accountCollectionRef = () => db.get().collection('accounts');
const transactionsCollectionRef = () => db.get().collection('transactions');

const addAccount = async (account) => {
  const isAccountPresent = await accountCollectionRef().findOne({ email: account.uniqueUserId });
  if (isAccountPresent) {
    throw new ConflictError('Account Already exists');
  }
  return accountCollectionRef().insertOne(account);
};

const getAccountDetails = ({ email }) => accountCollectionRef().findOne({ uniqueUserId: email });

const updateAccountBalance = async (account) => {
  const isAccountPresent = await accountCollectionRef().findOne({ email: account.email });
  if (!isAccountPresent) {
    throw new ConflictError('Account does not exist');
  }
  return accountCollectionRef().updateOne({ email: account.email }, { $set: { balance: account.balance } });
};

const addTransactions = (info) => transactionsCollectionRef().insertMany(info.transactions);

const getAllTransactions = ({ email }) => transactionsCollectionRef().find({ email }).sort({ date: -1 }).toArray();

const deleteAccount = (email) => accountCollectionRef().findOneAndDelete({ uniqueUserId: email });

const deleteTransactions = (email) => transactionsCollectionRef().deleteMany({ email });

export default {
  addAccount,
  updateAccountBalance,
  addTransactions,
  getAccountDetails,
  getAllTransactions,
  deleteAccount,
  deleteTransactions
};
