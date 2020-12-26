const dbAdapter = require("../db.connector");
const { Logger } = require("../consts/logger");
const { StatusCodes } = require("http-status-codes");
const { BookMessage } = require("../consts/message");

module.exports.getAuthors = function (req, res, next) {
  dbAdapter.query(
    "SELECT * FROM TAC_GIA WHERE TG_TEN IN (?)",
    [req.body.authors.filter((item) => isNaN(item * 1))],
    function (error, data) {
      if (error) {
        Logger.error("[Middleware.author.getAuthors]:", error);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: BookMessage.exception });
      } else {
        req.body.authors = req.body.authors.filter((item) => !isNaN(item * 1));

        req.body.authors.push(...data.map((x) => x.TG_MA));
        return next();
      }
    }
  );
};
