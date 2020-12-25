const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../consts/logger');
const { CommonMessage } = require('../consts/message');
const Resize = require('../utils/Resize');
const path = require('path');
module.exports.UploadImageHandle = async function (req, res, next) {
  // folder upload
  const imagePath = path.join(__dirname, '..', 'public');
  // call class Resize
  const fileUpload = new Resize(imagePath, req.file.originalname.split('.')[0]);
  if (!req.file) {
    return res.status(401).json({ error: 'Hãy chọn một bức ảnh' });
  }
  try {
    const filename = await fileUpload.save(req.file.buffer);
    Object.assign(req.body, { image: filename });

    Logger.warn('[MiddleWare.ImageUpload.Handler]: req.body', req.body);
    return next();
  } catch (error) {
    Logger.error('[MiddleWare.ImageUpload.Handler]', error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: CommonMessage.exception, error });
  }
};
