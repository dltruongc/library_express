const dbAdapter = require('../db.connector');
const { StatusCodes } = require('http-status-codes');
const { CommonMessage } = require('../consts/message');
const { Logger } = require('../consts/logger');
const { BcryptProvider } = require('../providers/bcrypt');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express'.NextFunction)} next
 */
module.exports.getAllUsers = function (req, res, next) {
  dbAdapter.query('SELECT * FROM DOC_GIA', function (error, data) {
    if (error) {
      Logger.error('[Controller.Books.getAll]:', error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: CommonMessage.exception });
    } else {
      return res.status(StatusCodes.OK).json(data);
    }
  });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express'.NextFunction)} next
 */
module.exports.findUserById = function (req, res, next) {
  const { id } = req.params;
  dbAdapter.query(
    `SELECT * FROM DOC_GIA WHERE DG_MA = ${id}`,
    function (error, data) {
      if (error) {
        Logger.error('[Controller.Books.getAll]:', error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: BookMessage.exception });
      } else {
        if (data.length === 0) {
          return res.status(StatusCodes.NO_CONTENT).json();
        }
        return res.json(data[0]);
      }
    }
  );
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express'.NextFunction)} next
 */
module.exports.createNewUser = async function (req, res, next) {
  const { password } = req.body;

  const { cipher, salt } = await BcryptProvider.hashPassword(password);

  password = cipher;

  // email,
  // avatar,

  dbAdapter.query(
    `INSERT INTO DOC_GIA DOC_GIA (CN_TEN, CN_SDT, CN_EMAIL, CN_NAM, CN_DIACHI, CN_TENTAIKHOAN, CN_MATKHAU, CN_SALT, CN_ANHDAIDIEN, TDG_MA) VALUES`,
    function (error, data) {
      if (error) {
        Logger.error('[Controller.Books.getAll]:', error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: BookMessage.exception });
      } else {
        if (data.length === 0) {
          return res.status(StatusCodes.NO_CONTENT).json();
        }
        return res.json(data[0]);
      }
    }
  );
};
