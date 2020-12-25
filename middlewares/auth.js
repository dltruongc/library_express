const { Logger } = require("../consts/logger");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { CommonMessage } = require("../consts/message");
const dbAdapter = require("../db.connector");

module.exports.authenticateToken = async function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

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
      `SELECT * FROM DOC_GIA WHERE DOC_GIA.CN_TENTAIKHOAN='${username}'`,
      function (error, data) {
        if (error) {
          Logger.error("[Middleware.auth]", error);

          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: CommonMessage.exception });
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
