import Promise from 'bluebird';
import pgPromise from 'pg-promise';
import pgMonitor from 'pg-monitor';

import config from '../../config';
import sql from '../sql';

const options = {
  promiseLib: Promise,
};

if (process.env.DEBUG) {
  pgMonitor.attach(options);
  pgMonitor.setTheme('matrix');
}

const pgp = pgPromise(options);

// Create a pg-promise db abstraction.
export const db = pgp(config.db);

// Create a per-sql query method that can be called like query.migrations()
// instead of db.query(sql.migrations).
function createQueryWrapper(methodName) {
  return Object.keys(sql).reduce((memo, key) => {
    memo[key] = (...args) => db[methodName](sql[key], ...args);
    return memo;
  }, {});
}

export const query = createQueryWrapper('query');
export const many = createQueryWrapper('many');
export const one = createQueryWrapper('one');
export const none = createQueryWrapper('none');
export const any = createQueryWrapper('any');
export const oneOrNone = createQueryWrapper('oneOrNone');
export const manyOrNone = createQueryWrapper('manyOrNone');
