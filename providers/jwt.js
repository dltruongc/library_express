const jwt = require("jsonwebtoken");

module.exports = function generateAccessToken(username, id) {
  return jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: 60 * 60,
  });
};
