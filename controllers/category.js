const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../consts/logger');
const { CommonMessage } = require('../consts/message');
const dbAdapter = require('../db.connector');

/**
 *
 * @param {import('express).Request} req
 * @param {import('express).Response} res
 * @param {import('express).NextFunction} next
 */
module.exports.getAllCategories = function (req, res, next) {
  dbAdapter.query('SELECT * FROM CHU_DE_SACH', function (error, data) {
    if (error) {
      Logger.error('[Controller.Category.getAll]', error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: CommonMessage.notFound });
    } else {
      return res.json(data);
    }
  });
};

/**
 *
 * @param {import('express).Request} req
 * @param {import('express).Response} res
 * @param {import('express).NextFunction} next
 */
module.exports.findById = function (req, res, next) {
  dbAdapter.query(
    'SELECT * FROM CHU_DE_SACH WHERE CDS_TEN=?',
    [req.params.id],
    function (error, data) {
      if (error) {
        Logger.error('[Controller.Category.findById]', error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: CommonMessage.notFound });
      } else {
        if (data.length === 0) return res.status(StatusCodes.NO_CONTENT).json();
        return res.json(data[0]);
      }
    }
  );
};

/**
 *
 * @param {import('express).Request} req
 * @param {import('express).Response} res
 * @param {import('express).NextFunction} next
 * @description take *req.body.category_name* from `Request.Body`
 */
module.exports.createNewCategory = function (req, res, next) {
  const fields = 'CDS_TEN';
  dbAdapter.query(
    `INSERT INTO CHU_DE_SACH (${fields}) VALUES (?)`,
    [[req.body.category_name]],
    function (error, data) {
      if (error) {
        Logger.error('[Controller.Category.create]', error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: CommonMessage.exception });
      } else {
        return res.json(data.insertId);
      }
    }
  );
};
