const bcrypt = require('bcryptjs');
const { Logger } = require('../consts/logger');

async function hashPassword(pwd) {
  try {
    const salt = await bcrypt.genSalt();
    const cipher = await bcrypt.hash(pwd, salt);
  } catch (err) {
    Logger.err('[Provider.HashPassword]', err);
    return {};
  }

  return { cipher, salt };
}

async function comparePassword(text, salt, pwd) {
  try {
    const generatedPassword = await bcrypt.hash(text, salt);
    return generatedPassword === pwd;
  } catch (err) {
    Logger.err('[Provider.ComparePassword]', err);
    throw new Exception(err);
  }
}

module.exports.BcryptProvider = { hashPassword, comparePassword };
