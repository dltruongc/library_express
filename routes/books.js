const router = require("express").Router();
const { body, param } = require("express-validator");

const BookController = require("../controllers/book");
const BookMiddleware = require("../middlewares/book");
const AuthorMiddleware = require("../middlewares/author");
const { generateAuthorIfNotExist } = require("../controllers/author");
const { Validation } = require("../middlewares/common");
const { MulterMiddleWare } = require("../middlewares/multer");
const { UploadImageHandle } = require("../middlewares/upload");

router
  .route("/")
  .get(
    BookController.getAllBooks,
    BookController.findBooksByCategory,
    BookController.findBooksByType,
    BookController.filterBooks
  )
  .post(
    [
      MulterMiddleWare.single("image"),
      body(["authors"]).notEmpty().toArray(),
      body(["title"]).trim().notEmpty(),
      body(["pages", "version", "volume", "nxb"]).isNumeric().toInt(),
      body(["keywords"]).optional().toArray(),
      body(["category_id", "type_id"]).notEmpty(),
      Validation,
    ],
    UploadImageHandle,
    generateAuthorIfNotExist,
    BookMiddleware.createNewBook,
    AuthorMiddleware.getAuthors,
    BookController.writenByAuthors
  );

router.route("/page/:page").get(BookController.pagination);

router
  .route("/copy")
  .post(
    [body("book_id").notEmpty(), Validation],
    BookController.generateCopyOfBook
  );

router
  .route("/details/:id")
  .get(
    [
      param("id").exists().toInt().withMessage(`'id' must be a number`),
      Validation,
    ],
    BookController.getDetail
  );

router
  .route("/count/:id")
  .get([param("id").notEmpty(), Validation], BookController.countCopiesOfBook);

router
  .route("/:id")
  .get(
    [
      param("id").exists().toInt().withMessage(`'id' must be a number`),
      Validation,
    ],
    BookController.findById
  );

module.exports = router;
