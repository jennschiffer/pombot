const pgp = require('pg-promise');

// build an object with keys for each query.
// names with _ get camel cased (e.g. find_by_id becomes findById)
const queries = pgp.utils.enumSql(__dirname, {}, function (file) {
  return pgp.QueryFile(file, {
    minify: true,
    // will automatically update if file time changes without
    // having to restart the process
    debug: process.env.DEBUG
  });
});

module.exports = queries;
