require('dotenv').config();

const { MDB = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

module.exports = { MDB };
