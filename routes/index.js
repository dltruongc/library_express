var express = require('express');
var router = express.Router();

router.use('/admin', require('./admin/index'));
router.use('/books', require('./books'));
router.use('/categories', require('./categories'));
router.use('/types', require('./book-types'));

module.exports = router;
