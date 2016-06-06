const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || '8000'

const express = require('express');
const path = require('path');
const app = express();

app.listen(port, host);

console.log('Server running on, %s:%d', host, port);

// just sending a test file back as a placeholder
app.get('/',
  function(req, res){
    res.sendFile(path.join(__dirname, '/test.html'));
  });

module.exports = app;
