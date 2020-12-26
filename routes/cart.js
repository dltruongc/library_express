const router = require('express').Router();
const CartController = require('../controllers/cart');
const CartMiddleware = require('../middlewares/cart');
const AuthMiddleware = require('../middlewares/auth');

router.post(
  '/checkout',
  AuthMiddleware.authenticateToken,
  AuthMiddleware.checkMemberCard,
  CartMiddleware.generateBorrowCard,
  CartMiddleware.getOneAvailableCopyOfBook,
  CartController.checkout
);

module.exports = router;
