import {QueryFile, utils} from 'pg-promise';

// build an object with keys for each query.
// names with _ get camel cased (e.g. find_by_id becomes findById)
const queries = utils.enumSql(__dirname, {}, file => {
  return QueryFile(file, { // eslint-disable-line new-cap
    minify: true,
    // will automatically update if file time changes without
    // having to restart the process
    debug: process.env.DEBUG,
  });
});

export default queries;
