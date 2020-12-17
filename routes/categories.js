const router = require('express').Router();
const { param, body } = require('express-validator');
const CategoryCtrl = require('../controllers/category');
const { Validation } = require('../middlewares/common');

router
  .route('/')
  .get(CategoryCtrl.getAllCategories)
  .post(
    [body('category_name').exists().isLength({ max: 30 }), Validation],
    CategoryCtrl.createNewCategory
  );

router
  .route('/:id')
  .get([param('id').isNumeric().toInt(), Validation], CategoryCtrl.findById);

module.exports = router;
