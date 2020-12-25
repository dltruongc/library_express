const router = require('express').Router();
const { param, body, query } = require('express-validator');
const AuthorController = require('../controllers/author');
const { Validation } = require('../middlewares/common');
router
  .route('/')
  .get(AuthorController.getAllAuthor)
  .post([Validation], AuthorController.createNewAuthor);

router.get(
  '/search',
  [query('q').notEmpty(), Validation],
  AuthorController.findAuthors
);

router
  .route('/:id')
  .get(
    [param('id').isNumeric().toInt(), Validation],
    AuthorController.findAuthorById
  );

module.exports = router;
