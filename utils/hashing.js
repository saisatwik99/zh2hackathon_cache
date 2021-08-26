import crypto from 'crypto';

const hash = (data, salt) => crypto.pbkdf2Sync(data, salt, 1000, 64, 'sha512').toString('hex');

export const ITERATIONS = 1000;
export const KEYLEN = 64;
export const DIGEST = 'sha512';

const verify = (input, password, salt) => {
  const hashed = crypto.pbkdf2Sync(input, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
  return hashed === password;
};

const hasher = {
  hash,
  verify
};

export default hasher;
