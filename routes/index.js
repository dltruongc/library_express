var express = require('express');
var router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
router.use('/admin', require('./admin/index'));
router.use('/books', require('./books'));
router.use('/categories', require('./categories'));
router.use('/types', require('./book-types'));
router.use('/authors', authenticateToken, require('./authors'));
router.use('/auth', require('./auth'));
router.use('/member-cards', require('./member.card'));
router.use('/cart', require('./cart'));

module.exports = router;
