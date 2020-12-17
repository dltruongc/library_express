const { StatusCodes } = require('http-status-codes');
const dbAdapter = require('../db.connector');
const { Logger } = require('../consts/logger');
const { CommonMessage } = require('../consts/message');
/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports.getAll = (req, res, next) => {
  dbAdapter.query('SELECT * FROM THELOAI', function (error, data) {
    if (error) {
      Logger.error('[Controller.BookTypes.getAll]', error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: CommonMessage.exception });
    } else {
      return res.json(data);
    }
  });
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports.findById = (req, res, next) => {
  dbAdapter.query(
    'SELECT * FROM THELOAI WHERE MATHELOAI=?',
    [req.params.id],
    function (error, data) {
      if (error) {
        Logger.error('[Controller.BookTypes.findById]', error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: CommonMessage.exception });
      } else {
        if (data.length === 0) {
          return res.status(StatusCodes.NOT_FOUND).json();
        }
        return res.json(data);
      }
    }
  );
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports.createNewBookType = (req, res, next) => {
  const fields = 'TENTHELOAI, THOIHANMUON';
  const { type_name, borrow_time } = req.body;
  dbAdapter.query(
    `INSERT INTO THELOAI (${fields}) VALUES (?)`,
    [[type_name, borrow_time]],
    function (error, data) {
      if (error) {
        Logger.error('[Controller.BookTypes.create]', error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: CommonMessage.exception });
      } else {
        return res.json(data.insertId);
      }
    }
  );
};
