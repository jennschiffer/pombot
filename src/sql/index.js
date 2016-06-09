const fs = require('fs');
const path = require('path');
const pgp = require('pg-promise');

function load(basePath) {
  return fs.readdirSync(basePath).reduce((result, queryFile) => {
    const query = path.basename(queryFile, '.sql');
    const isSqlFile = query !== queryFile;
    if (isSqlFile) {

      /* eslint new-cap: [0, { "newIsCapExceptions": ["QueryFile"] }] */
      result[query] = pgp.QueryFile(path.join(basePath, queryFile));
    }
    return result;
  }, {});
}

module.exports = load(__dirname);
