// Express
var express = require('express');
var history = require('connect-history-api-fallback');
var morgan  = require('morgan');
var bodyParser = require('body-parser');

var beekeepers = require('./routes/beekeepers');

// Express App
var app = express();

// Env
var PORT     = process.env.PORT || 3001;
var NODE_ENV = process.env.NODE_ENV || 'development';

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Angular Http content type for POST etc defaults to text/plain at
app.use(bodyParser.text(), function ngHttpFix(req, res, next) {
  try {
    req.body = JSON.parse(req.body);
    next();
  } catch(e) {
    next();
  }
});

// your api middleware

app.use('/api', beekeepers);

app.listen(PORT, function() {
  console.log('Listen on http://localhost:' + PORT + ' in ' + NODE_ENV);
});
