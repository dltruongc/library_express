const dbAdapter = require("../db.connector");
const { StatusCodes } = require("http-status-codes");
const { BookMessage, CommonMessage } = require("../consts/message");
const { Logger } = require("../consts/logger");
const { PageLimitation } = require("../consts/page.limitation");
const dateFormat = require("dateformat");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express'.NextFunction)} next
 */
module.exports.getAllBooks = function (req, res, next) {
  if (Object.keys(req.query).length > 0) {
    return next();
  }

  dbAdapter.query("SELECT * FROM SACH", function (error, data) {
    if (error) {
      Logger.error("[Controller.Books.getAll]:", error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: BookMessage.exception });
    } else {
      return res.status(StatusCodes.OK).json(data);
    }
  });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express'.NextFunction)} next
 */
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
        Logger.error("[Controller.Books.create]", error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: BookMessage.createError });
      } else {
        return res.status(StatusCodes.OK).json(data[1].insertId);
      }
    }
  );
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express'.NextFunction)} next
 */
module.exports.findById = function (req, res, next) {
  dbAdapter.query(
    `SELECT * FROM SACH WHERE S_Ma=${req.params.id}`,
    function (error, data) {
      if (error) {
        Logger.error("[Controller.Books.findOne:", error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: BookMessage.notFound });
      } else {
        if (data.length === 0) return res.status(StatusCodes.NO_CONTENT).json();
        return res.status(StatusCodes.OK).json(data[0]);
      }
    }
  );
};

module.exports.getDetail = function (req, res, next) {
  const { id } = req.params;
  dbAdapter.query(
    `SELECT * FROM SACH 
      JOIN LOAI_SACH ls 
        on SACH.LS_MA=ls.LS_MA, 
      TAC_GIA 
        WHERE S_Ma=${req.params.id}
          AND TAC_GIA.TG_MA IN (
            SELECT SANG_TAC.TG_MA 
              FROM SANG_TAC 
              WHERE SANG_TAC.S_MA = ${req.params.id})
    `.replace(/\s+/g, " "),

    function (error, data) {
      if (error) {
        Logger.error("[Controller.Books.getDetail:", error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: BookMessage.notFound });
      } else {
        if (data.length === 0) return res.status(StatusCodes.NO_CONTENT).json();
        let bookDetail = { ...data[0] };
        bookDetail.TG_MA = data.map((item) => item.TG_MA);
        bookDetail.TG_TEN = data.map((item) => item.TG_TEN);
        return res.status(StatusCodes.OK).json(bookDetail);
      }
    }
  );
};

module.exports.countCopiesOfBook = function (req, res, next) {
  const { id } = req.params;

  const q = `SELECT COUNT(*) AS COPIES FROM DAU_SACH WHERE DAU_SACH.S_MA = ${id}`;

  dbAdapter.query(q, function (error, data) {
    if (error) {
      Logger.error("[Controller.Books.countCopiesOfBook]", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: CommonMessage.exception, error });
    } else {
      return res.json({ count: data[0]?.COPIES });
    }
  });
};

module.exports.findBooksByCategory = function (req, res, next) {
  const { category } = req.query;
  if (!category) {
    return next();
  }

  const q = `SELECT * FROM SACH WHERE SACH.CDS_TEN = '${category}' `;

  dbAdapter.query(q, function (error, data) {
    if (error) {
      Logger.error("[Controller.Books.findBooksByCategory]", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: CommonMessage.exception, error });
    } else {
      return res.json(data);
    }
  });
};

module.exports.findBooksByType = function (req, res, next) {
  const { type } = req.query;

  if (!type) {
    return next();
  }

  const q = `SELECT * FROM SACH WHERE SACH.LS_MA = '${type}' `;

  dbAdapter.query(q, function (error, data) {
    if (error) {
      Logger.error("[Controller.Books.findBooksByTypes]", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: CommonMessage.exception, error });
    } else {
      return res.json(data);
    }
  });
};

module.exports.filterBooks = function (req, res, next) {
  const { search } = req.query;

  const q = `SELECT * FROM SACH WHERE SACH.S_TIEUDE LIKE '%${search}%' `;

  dbAdapter.query(q, function (error, data) {
    if (error) {
      Logger.error("[Controller.Books.findBooksByTypes]", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: CommonMessage.exception, error });
    } else {
      return res.json(data);
    }
  });
};

module.exports.pagination = (req, res, next) => {
  Logger.info("book pagination");

  let { page } = req.params;

  // if (!page) {
  //   // res.redirect("./1");
  // }

  page = page * 1;
  const offset = (page - 1) * PageLimitation;
  console.log({
    page,
    offset,
    limit: PageLimitation,
  });
  const q = `SELECT * FROM SACH LIMIT ${PageLimitation} OFFSET ${
    (page - 1) * PageLimitation
  };`;

  dbAdapter.query(q, function (error, data) {
    if (error) {
      Logger.error("[Controller.Books.pagination]:", error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: BookMessage.exception });
    } else {
      return res.status(StatusCodes.OK).json(data);
    }
  });
};

module.exports.generateCopyOfBook = function (req, res, next) {
  const { book_id } = req.body;
  const thisDate = dateFormat(new Date(), "yyyy-mm-dd");

  dbAdapter.query(
    `INSERT INTO DAU_SACH (S_MA, DS_NGAYTAO) VALUES (?)`,
    [[book_id, thisDate]],
    function (error, data) {
      if (error) {
        Logger.error("[Controller.Books.generateCopyOfBook]:", error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: BookMessage.exception });
      } else {
        return res.status(StatusCodes.OK).json(data.insertId);
      }
    }
  );
};

module.exports.writenByAuthors = function (req, res, next) {
  const { authors, id_book } = req.body;

  let q = "INSERT INTO SANG_TAC (S_MA, TG_MA) VALUES ";

  authors.forEach((author) => {
    q = q + `(${id_book}, ${author}), `;
  });

  q = q.trim().replace(/.$/, ";");

  dbAdapter.query(q, function (error, data) {
    if (error) {
      Logger.error("[Controller.Books.writtenByAuthors]:", error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: BookMessage.exception });
    } else {
      return res.status(StatusCodes.OK).json(data.insertId);
    }
  });
};
