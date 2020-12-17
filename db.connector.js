const MySql = require('mysql');
const dbAdapter = MySql.createConnection({
  charset: 'UTF8_GENERAL_CI',
  database: 'book',
  user: 'library',
  password: 'library',
  host: '192.168.64.2',
  port: 3306,
  flags: 'MULTI_STATEMENTS',
});

module.exports = dbAdapter;
