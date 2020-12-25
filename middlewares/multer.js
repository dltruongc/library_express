const multer = require('multer');

module.exports.MulterMiddleWare = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});
