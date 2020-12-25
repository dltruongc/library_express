const Logger = {
  info: function (message = null, ...optionalParams) {
    console.log('\x1b[34m', message, ...optionalParams);
  },

  log: function (message = null, ...optionalParams) {
    console.log('\x1b[34m', message, ...optionalParams);
  },

  warn: function (message = null, ...optionalParams) {
    console.log('\x1b[33m', message, ...optionalParams);
  },

  error: function (message = null, ...optionalParams) {
    console.log('\x1b[31m', message, ...optionalParams);
  },
};

module.exports.Logger = Logger;
