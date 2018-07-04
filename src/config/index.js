// src/config/index.js

require('dotenv').config();

module.exports = {
  appName: 'Hi. I am your friendly express server',
  port: 5000,
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host:     process.env.DB_HOST,
    dbName:   process.env.DB_NAME,
  },
};