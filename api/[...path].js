const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('../server/app');
const connectDB = require('../server/config/db');

let dbPromise;

module.exports = async (req, res) => {
  if (!dbPromise) {
    dbPromise = connectDB();
  }

  await dbPromise;
  return app(req, res);
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
