const dbAdapter = require('../db.connector');
const { StatusCodes } = require('http-status-codes');
const { CommonMessage, BookMessage } = require('../consts/message');
const { Logger } = require('../consts/logger');
const dateFormat = require('dateformat');
const getBorrowTimeByCopyOfBook = require('../providers/book');

module.exports.checkout = async function (req, res, next) {
  const { borrowCardId, book_copies } = req.body;
  let q =
    'INSERT INTO CHI_TIET_MUON (DS_MA, PM_STT, CTM_NGAYMUON, CTM_NGAYTRA) VALUES';

  const borrowTime = new Date();
  const CTM_NGAYMUON = dateFormat(borrowTime, 'yyyy-mm-dd');
  const CTM_NGAYTRA = dateFormat(
    new Date(borrowTime.getTime() + 7 * 24 * 60 * 60 * 1000),
    'yyyy-mm-dd'
  );

  // DS_MA, CTM_NGAYMUON, CTM_NGAYTRA

  book_copies.map((copy) => {
    q =
      q +
      `(${copy.DS_MA}, ${borrowCardId}, '${CTM_NGAYMUON}', '${CTM_NGAYTRA}'), `;
  });
  q = q.trim().replace(/.$/, ';');

  dbAdapter.query(q, function (error, data) {
    if (error) {
      Logger.error('[Controller.Books.getAll]:', error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: BookMessage.exception });
    } else {
      console.log(data);
      return res.status(StatusCodes.OK).json(data.insertId);
    }
  });
};
