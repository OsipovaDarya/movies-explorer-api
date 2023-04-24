const { BAD_REQUEST } = require('./Constans');

class DuplicationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = DuplicationError;
