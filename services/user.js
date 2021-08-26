import crypto from 'crypto';

import hasher from '../utils/hashing.js';
import utils from '../utils/utils.js';
import userDB from '../db/user.js';
import InternalServerError from '../utils/errors/internalServerError.js';
import NotFoundError from '../utils/errors/notFoundError.js';
import AuthError from '../utils/errors/authError.js';

const userSignUp = async ({
  firstName, lastName, email, password, dob
}) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = hasher.hash(utils.base64toString(password), salt);

  const user = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    dob,
    salt
  };

  // const { insertedId } = await userDB.addUser(user);
  // const userId = insertedId.toString();
  // if (!insertedId) {
  //   throw new InternalServerError('ID of User Not Found');
  // }

  // return utils.getToken(userId);
  const info = await userDB.addUser(user);
  if (info.error === undefined) {
    const userId = info.insertedId.toString();
    if (!info.insertedId) {
      return { error: 'ID of User Not Found', token: null };
    }

    return { error: null, token: utils.getToken(userId) };
  }
  return { error: info.error, token: null };
};

const userLogin = async ({ email, password: inputPassword }) => {
  const user = await userDB.getUserDetails({ email });
  if (!user) {
    return { error: 'User Not Found', token: null };
    // throw new NotFoundError('User Not Found');
  }
  if (!hasher.verify(utils.base64toString(inputPassword), user.password, user.salt)) {
    return { error: 'Incorrect Password', token: null };
    // throw new AuthError();
  }

  return { error: null, token: utils.getToken(user._id) };
  // return utils.getToken(user._id)
};

export default {
  userSignUp,
  userLogin
};
