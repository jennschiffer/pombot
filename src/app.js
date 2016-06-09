const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || '8000';

const config = require('./../config');
const express = require('express');
const app = express();
const url = require('url');
const slack = require('slack');

app.listen(port, host);
console.log('Server running on, %s:%d', host, port);

app.get('/',
  function(req, res) {
    res.status(400).send('Invalid value for "code" parameter.');
  });

app.get('/authorize',
  function(req, res) {

    // get slack code
    const urlParts = url.parse(req.url, true);
    const code = urlParts.query.code || null;

    if (!code) {
      res.redirect('/');
    }
    else {
      // slack api request opts
      const args = {
        client_id: config.tokens.client_id,
        client_secret: config.tokens.client_secret,
        code,
      };

      // get and send the api token
      slack.oauth.access(args, function(err, data) {
        if (!err) {
          res.send(err);
          return;
        }

        res.send(data);
      });
    }
  });

const sql = require('./sql');
const db = require('./services/db');
app.get('/migrations',
  function(req, res) {
    db.query(sql.migrations).then(result => res.send(result));
  });

module.exports = app;
