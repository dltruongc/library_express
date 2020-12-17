const { StatusCodes } = require('http-status-codes');
const { CommonMessage } = require('../consts/message');
const { validationResult, check, sanitizeParam } = require('express-validator');

module.exports.QueryID = function (error, req, res, next) {
  console.error('[Middleware.Common.QueryID]:', error.message);
  if (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: CommonMessage.exception, error: error.message });
  }

  if (req.params.id) req.params.id = req.params.id.trim().replace(' ', '') * 1;
  if (isNaN(req.params.id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: CommonMessage.invalidIdParams,
      error: typeof req.params.id,
    });
  }
};

module.exports.BodyId = function (error, req, res, next) {
  console.error('[Middleware.Common.BodyId]:', error.message);
  if (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: CommonMessage.exception, error: error.message });
  }

  if (req.params.id) req.params.id = req.params.id.trim().replace(' ', '') * 1;
  if (isNaN(req.params.id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: CommonMessage.invalidIdParams,
      error: typeof req.params.id,
    });
  }
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports.Validation = function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return next();
};
