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
  dbAdapter.query('SELECT * FROM SACH', function (error, data) {
    if (error) {
      Logger.error('[Controller.Books.getAll]:', error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: BookMessage.exception });
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
module.exports.createNewBook = function (req, res, next) {
  const {
    type_id,
    nxb,
    category_id,
    title,
    version,
    pages,
    keywords,
    description,
    image,
  } = req.body;
  // FIXME: req.body AND dbAdapterQuery
  const fields =
    'S_TIEUDE, S_SOTRANG, S_LANXUATBAN, S_TUKHOA, NXB, CDS_TEN, LS_MA, S_HINHANH';

  let query = dbAdapter.query(
    `INSERT IGNORE INTO NAM_XUAT_BAN VALUES (?); INSERT INTO SACH (${fields}) VALUES (?)`,
    [
      [nxb],
      [
        title,
        pages,
        version,
        keywords.join(', '),
        nxb,
        category_id,
        type_id,
        image,
      ],
    ],
    function (error, data) {
      if (error) {
        Logger.log(error.sql);
        Logger.error('[Controller.Books.create]', error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: BookMessage.createError });
      } else {
        return res.status(StatusCodes.OK).json(data.insertId);
      }
    }
  );
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express'.NextFunction)} next
 */
module.exports.findById = function (req, res, next) {
  dbAdapter.query(
    `SELECT * FROM SACH WHERE S_Ma=${req.params.id}`,
    function (error, data) {
      if (error) {
        Logger.error('[Controller.Books.findOne:', error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: BookMessage.notFound });
      } else {
        if (data.length === 0) return res.status(StatusCodes.NO_CONTENT).json();
        return res.status(StatusCodes.OK).json(data[0]);
      }
    }
  );
};
