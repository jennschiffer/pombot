'use strict';

require('dotenv').config();

module.exports = {
  tokens: {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
  },
};
