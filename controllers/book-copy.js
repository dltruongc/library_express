const { Logger } = require('../consts/logger');
const { CommonMessage } = require('../consts/message');
const { StatusCodes } = require('http-status-codes');
const dbAdapter = require('../db.connector');

module.exports.createBookCopy = function (req, res, next) {
  const book_id = req.body;
  const q = 'INSERT INTO DAU_SACH (S_MA, DS_NGAYTAO) VALUES (?)';

  dbAdapter.query(
    q,
    [book_id, new Date().toLocaleDateString()],
    function (error, data) {
      if (error) {
        Logger.log('[Controller.BookCopy]', error);
        return res
          .statusCode(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: CommonMessage.exception, error });
      } else {
        return res.json({ id: data.insertId });
      }
    }
  );
};
