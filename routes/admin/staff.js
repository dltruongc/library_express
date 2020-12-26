const router = require('express').Router();
const { body } = require('express-validator');
const StaffController = require('../../controllers/staff');
const { Validation } = require('../../middlewares/common');
const { MulterMiddleWare } = require('../../middlewares/multer');
const { UploadImageHandle } = require('../../middlewares/upload');
const AuthMiddleware = require('../../middlewares/auth');

router.post('/signup', MulterMiddleWare.single('avatar'), UploadImageHandle, [
  body('name').isString().isLength({ max: 50 }),
  body('phone').notEmpty().isLength({ max: 12 }),
  body('email').notEmpty(),
  body('gender').isBoolean(),
  body('address').isString(),
  body('username').notEmpty().isLength({ max: 32 }),
  body('password').notEmpty(),
  body('worked_at').optional().isDate(),
  Validation,
  StaffController.createNewStaff,
]);

router.post('/signin', [
  body('username').notEmpty(),
  body('password').notEmpty(),
  Validation,
  StaffController.login,
]);

router.post('/confirmation', [
  AuthMiddleware.authenticateToken,
  AuthMiddleware.staffAuth,
  body('borrow_card_id').isNumeric(),
  body('copy_book_id').isNumeric(),
  Validation,
  StaffController.confirmBorrowRequest,
]);

module.exports = router;
