const { Logger } = require('../consts/logger');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { CommonMessage } = require('../consts/message');
const dbAdapter = require('../db.connector');

module.exports.authenticateToken = async function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: CommonMessage.unauthorized });

  try {
    let { exp, username } = jwt.verify(token, process.env.TOKEN_SECRET);

    if (Date.now() >= exp * 1000) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: CommonMessage.expired });
    }

    dbAdapter.query(
      `SELECT * FROM NGUOI_DUNG WHERE NGUOI_DUNG.CN_TENTAIKHOAN='${username}'`,
      function (error, data) {
        if (error) {
          Logger.error('[Middleware.auth]', error);

          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: CommonMessage.exception });
        }

        if (data.length > 1) {
          const staff = data.find((item) => item.QT_NGAYNHANVIEC !== null);
          const user = data.find((item) => item.QT_NGAYNHANVIEC === null);
          req.user = user;
          req.staff = staff;
          return next();
        }

        req.user = data[0];
        return next();
      }
    );
  } catch (err) {
    Logger.error(err);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: CommonMessage.unauthorized });
  }
};

module.exports.staffAuth = function (req, res, next) {
  if (!req.staff) {
    return res
      .status(401)
      .json({ message: 'Bạn không có quyền thực hiện hành động này' });
  } else {
    return next();
  }
};

module.exports.checkMemberCard = function (req, res, next) {
  if (!req.user?.TDG_MA) {
    return res
      .status(401)
      .json({ message: 'Bạn không có thẻ độc giả hoặc thẻ độc giả hết hạn' });
  } else {
    dbAdapter.query(
      `SELECT TDG_NGAYHETHAN FROM THE_DOC_GIA WHERE THE_DOC_GIA.TDG_MA =${req.user.TDG_MA}`,
      function (error, data) {
        if (error) {
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: CommonMessage.exception, error });
        }

        if (data.length === 0) {
          return res.status(401).json({ message: 'Thẻ độc giả đã hết hạn' });
        }

        return next();
      }
    );
  }
};
