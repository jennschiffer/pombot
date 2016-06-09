const bluebird = require('bluebird');
const pgp = require('pg-promise');
const monitor = require('pg-monitor');

const config = require('../../config');

const options = {
  promiseLib: bluebird
};

if (process.env.DEBUG) {
  monitor.attach(options);
  monitor.setTheme('matrix');
}

const db = pgp(options);

module.exports = db(config.db);
