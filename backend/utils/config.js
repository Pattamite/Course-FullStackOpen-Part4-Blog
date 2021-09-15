require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;
const SECRET = process.env.SECRET;
const NODE_ENV = process.env.NODE_ENV;

const config = {
  PORT,
  MONGODB_URI,
  SECRET,
  NODE_ENV
};

module.exports = config;