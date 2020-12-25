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
  dbAdapter.query('SELECT * FROM LOAI_SACH', function (error, data) {
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
    'SELECT * FROM LOAI_SACH WHERE LS_MA=?',
    [req.params.id],
    function (error, data) {
      if (error) {
        Logger.error('[Controller.BookTypes.findById]', error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: CommonMessage.exception });
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
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports.createNewBookType = (req, res, next) => {
  const fields = 'LS_MA, LS_TEN, LS_THOIHANMUON';
  const { type_id, type_name, borrow_time } = req.body;
  dbAdapter.query(
    `INSERT INTO LOAI_SACH (${fields}) VALUES (?)`,
    [[type_id, type_name, borrow_time]],
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
