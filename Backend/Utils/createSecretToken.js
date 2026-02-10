require('dotenv').config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 21 * 24 * 60 * 60,    //expire in 21 days
  });
};