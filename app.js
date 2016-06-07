const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || '8000'

const config = require('./config');
const express = require('express');
const path = require('path');
const app = express();
const url = require('url');
const slack = require('slack');

app.listen(port, host);
console.log('Server running on, %s:%d', host, port);

app.get('/',
  function(req, res) {

    // get slack code
    const urlParts = url.parse(req.url, true);
    const code = urlParts.query.code || null;

    if (!code ) {
      return;
    }
    else {
      // slack api request opts
      const args = {
        client_id: config.tokens.client_id,
        client_secret: config.tokens.client_secret,
        code: code
      };

      // get and send the api token
      slack.oauth.access(args, function(err, data){
        res.send(data);
      });
    }

  });

module.exports = app;
