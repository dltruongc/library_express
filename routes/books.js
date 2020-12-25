const router = require('express').Router();
const { body, param } = require('express-validator');

const BookController = require('../controllers/book');
const { Validation } = require('../middlewares/common');
const { MulterMiddleWare } = require('../middlewares/multer');
const { UploadImageHandle } = require('../middlewares/upload');

router
  .route('/')
  .get(BookController.getAllBooks)
  .post(
    [
      MulterMiddleWare.single('image'),

      body(['title']).trim().notEmpty(),
      body(['pages', 'version', 'volume', 'nxb']).isNumeric().toInt(),
      body(['keywords']).optional().toArray(),
      body(['category_id', 'type_id']).notEmpty(),
      Validation,
    ],
    UploadImageHandle,
    BookController.createNewBook
  );

router
  .route('/:id')
  .get(
    [
      param('id').exists().toInt().withMessage(`'id' must be a number`),
      Validation,
    ],
    BookController.findById
  );

module.exports = router;
