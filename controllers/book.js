const dbAdapter = require('../db.connector');
const { StatusCodes } = require('http-status-codes');
const { BookMessage } = require('../consts/message');
const { Logger } = require('../consts/logger');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express'.NextFunction)} next
 */
module.exports.getAllBooks = function (req, res, next) {
  dbAdapter.query('SELECT * FROM DAUSACH', function (error, data) {
    if (error) {
      Logger.error('[Controller.Books.getAll]:', error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: BookMessage.notFound });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json(data);
    }
  });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express'.NextFunction)} next
 */
module.exports.createNewBook = function (req, res, next) {
  const {
    name,
    pages,
    version,
    volume,
    nxb,
    keywords,
    category_id,
    type_id,
  } = req.body;
  // FIXME: req.body AND dbAdapterQuery
  const fields =
    'TENDAUSACH, SOTRANG, LANXUATBAN, TUKHOA, SOLUONG, nxbNxb, danhMucMaDanhMuc, theLoaiMaTheLoai';

  let query = dbAdapter.query(
    `INSERT IGNORE INTO NXB VALUES (?); INSERT INTO DAUSACH (${fields}) VALUES (?)`,
    [
      [nxb],
      [
        name,
        pages,
        version,
        keywords.join(', '),
        volume,
        nxb,
        category_id,
        type_id,
      ],
    ],
    function (error, data) {
      if (error) {
        Logger.error('[Controller.Books.create]', error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: BookMessage.createError });
      } else {
        return res.status(StatusCodes.NOT_FOUND).json(data.insertId);
      }
    }
  );
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express'.NextFunction)} next
 */
module.exports = function (req, res, next) {
  dbAdapter.query(
    `SELECT * FROM DAUSACH WHERE MADAUSACH=${req.params.id}`,
    function (error, data) {
      if (error) {
        Logger.error('[Controller.Books.findOne:', error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: BookMessage.notFound });
      } else {
        return res.status(StatusCodes.NOT_FOUND).json(data);
      }
    }
  );
};
