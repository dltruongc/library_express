const router = require('express').Router();
const { param, body } = require('express-validator');
const BookTypesController = require('../controllers/book-types');
const { Validation } = require('../middlewares/common');

router
  .route('/')
  .get(BookTypesController.getAll)
  .post(
    [
      body('type_name').exists().isLength({ max: 30 }),
      body('borrow_time').isNumeric(),
      Validation,
    ],
    BookTypesController.createNewBookType
  );

router
  .route('/:id')
  .get(
    [param('id').isNumeric().toInt(), Validation],
    BookTypesController.findById
  );

module.exports = router;
