// Removes optional dependencies in package.json from npm-shrinkwrap.json,
// allowing the OS X-specific "fsevents" module to be used while the project
// gets deployed to linux systems for testing/deployment
//
// Use  after "npm shrinkwrap"
//
// See https://github.com/npm/npm/issues/2679

import fs from 'fs';
import path from 'path';

const getRootPath = (...args) => path.resolve(__dirname, '..', ...args);

const filename = 'npm-shrinkwrap.json';
const filepath = getRootPath(filename);
const data = require(filepath);

const pkg = require(getRootPath('package'));
const optionals = Object.keys(pkg.optionalDependencies || []);
optionals.forEach(name => {
  console.log(`Ensuring optional dependency "${name}" is removed`);
  delete data.dependencies[name];
});

fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
console.log(`Rewrote ${filename}`);
