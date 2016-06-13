'use strict';

require('dotenv').config();

module.exports = {
  app: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || '8000',
  },
  tokens: {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
};
