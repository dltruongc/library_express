const Logger = {
  info: function (message = null, ...optionalParams) {
    console.log('\x1b[34m', message, '\x1b[30m', ...optionalParams);
  },

  log: function (message = null, ...optionalParams) {
    console.log('\x1b[34m', message, '\x1b[30m', ...optionalParams);
  },

  warn: function (message = null, ...optionalParams) {
    console.log('\x1b[33m', message, '\x1b[30m', ...optionalParams);
  },

  error: function (message = null, ...optionalParams) {
    console.log('\x1b[31m', message, '\x1b[30m', ...optionalParams);
  },
};

module.exports.Logger = Logger;
