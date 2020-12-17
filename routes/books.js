const { body, param } = require('express-validator');
const { Validation } = require('../middlewares/common');
const router = require('express').Router();
const BookController = require('../controllers/book');

router
  .route('/')
  .get(BookController.getAllBooks)
  .post(
    [
      // ' TUKHOA, danhMucMaDanhMuc, theLoaiMaTheLoai';
      body(['name']).trim().exists(),
      body(['pages', 'version', 'volume', 'nxb']).isNumeric().toInt(),
      body(['keywords']).optional().toArray(),
      body(['category_id', 'type_id']).isNumeric().toInt(),
      Validation,
    ],
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
