import jwt from 'jsonwebtoken';

import userDB from '../db/user.js';

const jwtConst = {
  issuer: 'fanta',
  expiresIn: process.env.NODE_ENV === 'staging' ? '4d' : '60m'
};

const envSecret = () => process.env.SECRET_KEY;

const base64toString = (b64) => Buffer.from(b64, 'base64').toString();

const getToken = (id) => jwt.sign({ id }, envSecret(), jwtConst);

// eslint-disable-next-line no-unused-vars
const isTokenValid = (req, res, next) => {
  const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || '';
  return jwt.verify(token, envSecret(), jwtConst);
};

const verifyAuthToken = async (req, res, next) => {
  const token = req.session.authtoken;
  if (!token) {
    return res.redirect('/api/user/login');
  }
  try {
    jwt.verify(token, envSecret(), jwtConst);

    const data = jwt.decode(token, jwtConst);
    const user = await userDB.getUserDetails({ userId: data.id });
    req.user = user;

    return next();
  } catch (err) {
    return res.redirect('/api/user/login');
  }
};

export default {
  base64toString,
  getToken,
  verifyAuthToken,
  isTokenValid
};
