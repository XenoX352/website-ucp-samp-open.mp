const argon2 = require('argon2');
const bcrypt = require('bcrypt');

const hashPassword = async (plain) => {
  return await argon2.hash(plain, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1
  });
};

const verifyPassword = async (hash, plain) => {
  try {
    return await argon2.verify(hash, plain);
  } catch (err) {
    return await bcrypt.compare(plain, hash);
  }
};

module.exports = { hashPassword, verifyPassword };