const { StatusCodes } = require("http-status-codes");
const { Logger } = require("../consts/logger");
const { CommonMessage } = require("../consts/message");
const dbAdapter = require("../db.connector");

module.exports.getAllAuthor = function (req, res, next) {
  const q = "SELECT * FROM TAC_GIA";
  dbAdapter.query(q, function (error, data) {
    if (error) {
      Logger.error("[Author.controller.getAll]", error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: CommonMessage.exception });
    } else {
      return res.json(data);
    }
  });
};

module.exports.findAuthors = function (req, res, next) {
  search = req.query.q;
  const q = `SELECT * FROM TAC_GIA WHERE TG_Ten LIKE '%${search}%'`;
  dbAdapter.query(q, function (error, data) {
    if (error) {
      Logger.error("[Author.controller.getAll]", error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: CommonMessage.exception });
    } else {
      return res.json(data);
    }
  });
};

module.exports.findAuthorById = function (req, res, next) {
  const search = req.params.id;
  const q = `SELECT * FROM TAC_GIA WHERE TG_Ten LIKES %${search}%`;
  dbAdapter.query(q, function (error, data) {
    if (error) {
      Logger.error("[Author.controller.getAll]", error.message);
    } else {
      if (!data || data.length === 0)
        return res.status(StatusCodes.NO_CONTENT).json();
      return res.json(data[0]);
    }
  });
};

module.exports.createNewAuthor = function (req, res, next) {
  const { name } = req.body;
  const q = `INSERT INTO TAC_GIA (TG_Ten) VALUES (${name});`;
  dbAdapter.query(q, function (error, data) {
    if (error) {
      Logger.error("[Author.controller.create]", error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: CommonMessage.notFound });
    } else {
      return res.json(data.insertId);
    }
  });
};

module.exports.generateAuthorIfNotExist = function (req, res, next) {
  const { authors } = req.body;
  let q = `INSERT IGNORE INTO TAC_GIA (TG_Ten) VALUES `;
  authors.forEach((author) => {
    if (isNaN(author * 1)) {
      q = q + `('${author}'), `;
    }
  });
  q = q.trimEnd().replace(/.$/, ";");
  dbAdapter.query(q, function (error, data) {
    if (error) {
      Logger.error(
        "[Author.controller.generateAuthorIfNotExist]",
        error.message
      );
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: CommonMessage.notFound });
    } else {
      return next();
    }
  });
};
