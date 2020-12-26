const dbAdapter = require('../db.connector');
const { CommonMessage } = require('../consts/message');
const { Logger } = require('../consts/logger');
const { BookMessage } = require('../consts/message');
const dateFormat = require('dateFormat');
const { StatusCodes } = require('http-status-codes');

module.exports.generateBorrowCard = function (req, res, next) {
  console.log(req.user.CN_MA);
  const borrowTime = new Date();
  const PM_NGAYMUON = dateFormat(borrowTime, 'yyyy-mm-dd');
  const PM_NGAYTRA = dateFormat(
    new Date(borrowTime.getTime() + 7 * 24 * 60 * 60 * 1000),
    'yyyy-mm-dd'
  );
  dbAdapter.query(
    'INSERT INTO PHIEU_MUON (TDG_MA, PM_NGAYMUON, PM_NGAYTRA) VALUES (?)',
    [[req.user.TDG_MA, PM_NGAYMUON, PM_NGAYTRA]],
    function (error, data) {
      if (error) {
        Logger.error('[Middleware.cart.generateBorrowCard]:', error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: CommonMessage.exception });
      } else {
        console.log(data);
        req.body.borrowCardId = data.insertId;
        req.body.borrowDate = PM_NGAYMUON;
        return next();
      }
    }
  );
};

module.exports.getOneAvailableCopyOfBook = function (req, res, next) {
  const { book_ids } = req.body;
  let q = `SELECT Min(DAU_SACH.DS_MA) AS DS_MA, DAU_SACH.S_MA
  FROM DAU_SACH LEFT JOIN CHI_TIET_MUON on DAU_SACH.DS_MA = CHI_TIET_MUON.DS_MA 
  WHERE DAU_SACH.S_MA IN (${book_ids.join(', ')})
    AND CHI_TIET_MUON.DS_MA IS NULL
    OR (
      CHI_TIET_MUON.DS_MA IS NOT NULL 
      AND CHI_TIET_MUON.PT_MA IS NOT NULL)
  GROUP BY DAU_SACH.S_MA`;

  dbAdapter.query(q, function (error, data) {
    if (error) {
      Logger.error(
        '[Middleware.cart.getOneAvailableCopyOfBook]:',
        error.message
      );
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: BookMessage.exception });
    } else {
      req.body.book_copies = data;
      return next();
    }
  });
};
