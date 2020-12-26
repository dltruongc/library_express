const dbAdapter = require('../db.connector');
const { Logger } = require('../consts/logger');

module.exports = function getBorrowTime(...idBooks) {
  dbAdapter.query(
    `SELECT SACH.S_MA, LOAI_SACH.LS_THOIHANMUON FROM LOAI_SACH JOIN SACH ON LOAI_SACH.LS_MA=SACH.LS_MA WHERE SACH.S_MA IN (${idBooks.join(
      ', '
    )})`,
    function (error, data) {
      if (error) {
        Logger.error('[Middleware.Books.create]', error.message);
        return null;
      } else {
        Logger.error('[Middleware.Books.create]', data);
        console.log(data);
        console.log(
          data.map((row) => {
            return { S_MA: row.S_MA, LS_THOIHAMUON: row.LS_THOIHANMUON };
          })
        );
        return data[0].LS_THOIHAMUON;
      }
    }
  );
  dbAdapter.end();
};

module.exports = async function getBorrowTimeByCopyOfBook(...copyOfBookIds) {
  return new Promise((resolve, reject) => {
    dbAdapter.query(
      `SELECT 
          DS.S_MA, 
          LOAI_SACH.LS_THOIHANMUON 
      FROM DAU_SACH DS JOIN SACH S on DS.S_MA=S.S_MA JOIN LOAI_SACH 
              ON LOAI_SACH.LS_MA=S.LS_MA 
      WHERE DS.DS_MA IN (${copyOfBookIds.join(', ')})`,
      function (error, data) {
        if (error) {
          Logger.error(
            '[Provider.Book.getBorrowTimeByCopyOfBook]',
            error.message
          );
          reject(error);
          return null;
        } else {
          console.log(data);
          // console.log(
          //   data.map((row) => {
          //     return { S_MA: row.S_MA, LS_THOIHAMUON: row.LS_THOIHANMUON };
          //   })
          // );
          resolve(data[0].LS_THOIHAMUON);
          return data[0].LS_THOIHAMUON;
        }
      }
    );
  });
};
