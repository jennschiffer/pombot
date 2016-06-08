const path = require('path');
const config = require('./config');

module.exports = {
  client: {
    name: 'postgresql',
    config: config.db,
  },
  files: {
    directory: path.join(__dirname, 'migrations'),
  },
};
