const { StatusCodes } = require("http-status-codes");

const dbAdapter = require("../db.connector");
const { Logger } = require("../consts/logger");
const { BookMessage } = require("../consts/message");

module.exports.createNewBook = function (req, res, next) {
  const {
    type_id,
    nxb,
    category_id,
    title,
    version,
    pages,
    keywords,
    description,
    image,
  } = req.body;
  // FIXME: req.body AND dbAdapterQuery
  const fields =
    "S_TIEUDE, S_SOTRANG, S_LANXUATBAN, S_TUKHOA, NXB, CDS_TEN, LS_MA, S_HINHANH";

  let query = dbAdapter.query(
    `INSERT IGNORE INTO NAM_XUAT_BAN VALUES (?); INSERT INTO SACH (${fields}) VALUES (?)`,
    [
      [nxb],
      [
        title,
        pages,
        version,
        keywords.join(", "),
        nxb,
        category_id,
        type_id,
        image,
      ],
    ],
    function (error, data) {
      if (error) {
        Logger.error("[Middleware.Books.create]", error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: BookMessage.createError });
      } else {
        req.body = { ...req.body, id_book: data[1].insertId };
        console.log(data[1].insertId);
        return next();
      }
    }
  );
};
