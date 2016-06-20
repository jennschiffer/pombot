import {QueryFile, utils} from 'pg-promise';

// Here we build a camelized tree with file paths for values, using camelizeVar,
// and then replace each path with a QueryFile object.
// See the API:
// http://vitaly-t.github.io/pg-promise/utils.html#.enumSql
// http://vitaly-t.github.io/pg-promise/utils.html#.camelizeVar
const queries = utils.enumSql(__dirname, {}, file => {
  return QueryFile(file, { // eslint-disable-line new-cap
    minify: true,
    // will automatically update if file time changes without
    // having to restart the process
    debug: process.env.NOCACHE_SQL,
  });
});

export default queries;
