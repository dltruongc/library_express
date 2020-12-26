const { StatusCodes } = require('http-status-codes');
const { CommonMessage } = require('../consts/message');
const dbAdapter = require('../db.connector');
const dateFormat = require('dateformat');
module.exports.getAllCards = function (req, res, next) {
  dbAdapter.query(`SELECT * FROM THE_DOC_GIA`, function (error, data) {
    if (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: CommonMessage.exception, error });
    }
    return res.json(data);
  });
};

module.exports.findCardById = function (req, res, next) {
  const { id } = req.params;
  dbAdapter.query(
    `SELECT * FROM THE_DOC_GIA WHERE TDG_MA=${id}`,
    function (error, data) {
      if (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: CommonMessage.exception, error });
      }
      if (data.length === 0) return res.status(StatusCodes.NO_CONTENT).json();
      return res.json(data[0]);
    }
  );
};

module.exports.findCardByIdUser = function (req, res, next) {
  const { id_user } = req.query;
  dbAdapter.query(
    `SELECT * FROM THE_DOC_GIA WHERE THE_DOC_GIA.DOC_CN_MA = ${id_user}`,
    function (error, data) {
      if (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: CommonMessage.exception, error });
      }
      if (data.length === 0) return res.status(StatusCodes.NO_CONTENT).json();

      return res.json(data[0]);
    }
  );
};

module.exports.createNewCard = function (req, res, next) {
  const { staff_id, user_id, create_date, expire_date } = req.body;
  const parsedcreate_date = dateFormat(create_date, 'yyyy-mm-dd');
  const parsedexpire_date = dateFormat(expire_date, 'yyyy-mm-dd');
  dbAdapter.query(
    `INSERT INTO THE_DOC_GIA (CN_MA, DOC_CN_MA, TDG_NGAYCAP, TDG_NGAYHETHAN) VALUES (?); 
    UPDATE DOC_GIA SET TDG_MA=(SELECT TDG_MA FROM THE_DOC_GIA WHERE DG_MA=${user_id})`,
    [[staff_id * 1, user_id * 1, parsedcreate_date, parsedexpire_date]],
    function (error, data) {
      if (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: CommonMessage.exception, error });
      }
      return res.json(data.insertId);
    }
  );
};
