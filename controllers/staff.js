const dbAdapter = require("../db.connector");
const { StatusCodes } = require("http-status-codes");
const { CommonMessage } = require("../consts/message");
const { Logger } = require("../consts/logger");
const { BcryptProvider } = require("../providers/bcrypt");
const generateAccessToken = require("../providers/jwt");
const dateFormat = require("dateformat");

module.exports.getAllStaffs = function (req, res, next) {
  dbAdapter.query("SELECT * FROM QUAN_THU", function (error, data) {
    if (error) {
      Logger.error("[Controller.Admin.Staff.getAll]:", error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: CommonMessage.exception });
    } else {
      return res.status(StatusCodes.OK).json(data);
    }
  });
};

module.exports.findStaffById = function (req, res, next) {
  const { id } = req.params;
  dbAdapter.query(
    `SELECT * FROM QUAN_THU WHERE QT_MA = ${id}`,
    function (error, data) {
      if (error) {
        Logger.error("[Controller.Admin.Staff.getAll]:", error.message);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: BookMessage.exception });
      } else {
        if (data.length === 0) {
          return res.status(StatusCodes.NO_CONTENT).json();
        }
        return res.json(data[0]);
      }
    }
  );
};

module.exports.createNewStaff = async function (req, res, next) {
  const {
    name,
    phone,
    email,
    gender,
    address,
    username,
    password,
    image,
    worked_at,
  } = req.body;

  const worked_date = worked_at ?? new Date();

  const { cipher, salt } = await BcryptProvider.hashPassword(password);
  const hashedPassword = cipher;

  dbAdapter.query(
    `SELECT * FROM QUAN_THU WHERE QUAN_THU.CN_TENTAIKHOAN='${username}'`,
    function (error, data) {
      if (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: CommonMessage.exception, error });
      }

      if (data.length !== 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: CommonMessage.duplicatedUsername, error });
      }

      dbAdapter.query(
        `INSERT INTO QUAN_THU (CN_TEN, CN_SDT, CN_EMAIL, CN_NAM, CN_DIACHI, CN_TENTAIKHOAN, CN_MATKHAU, CN_SALT, CN_ANHDAIDIEN, QT_NGAYNHANVIEC) VALUES (?)`,
        [
          [
            name,
            phone,
            email,
            gender,
            address,
            username,
            hashedPassword,
            salt,
            image,
            worked_date,
          ],
        ],
        function (error, data) {
          if (error) {
            console.log(error.sql);
            Logger.error("[Controller.Admin.Staff.createNew]:", error.message);
            return res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ message: CommonMessage.exception });
          } else {
            return res.json(data.insertId);
          }
        }
      );
    }
  );
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express'.NextFunction)} next
 */
module.exports.login = async function (req, res, next) {
  const { username, password } = req.body;

  dbAdapter.query(
    `SELECT * FROM QUAN_THU WHERE QUAN_THU.CN_TENTAIKHOAN='${username}'`,
    async function (error, data) {
      if (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: CommonMessage.exception, error });
      }

      if (data.length === 0) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: CommonMessage.wrongUsername });
      }

      const dbUsername = data[0].CN_TENTAIKHOAN;
      const id = data[0].DG_MA;
      const dbSalt = data[0].CN_SALT;
      const dbPassword = data[0].CN_MATKHAU;
      const isMatches = await BcryptProvider.comparePassword(
        password,
        dbSalt,
        dbPassword
      );

      if (!isMatches) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: CommonMessage.wrongPassword });
      }

      return res.json({ token: generateAccessToken(dbUsername, id) });
    }
  );
};
