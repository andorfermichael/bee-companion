var express = require('express');
var app = express();

// Auth0 dependencies
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var history = require('connect-history-api-fallback');
var morgan  = require('morgan');
var bodyParser = require('body-parser');

var beekeepers = require('./routes/beekeepers');

// Env
var PORT     = process.env.PORT || 3000;
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
// Auth0

var authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://bee-companion.eu.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://bee-companion.com/api',
    issuer: "https://bee-companion.eu.auth0.com/",
    algorithms: ['RS256']
});

app.use(authCheck);

app.get('/api/authorized', authCheck, function (req, res) {
  res.send('Secured Resource');
});

app.listen(PORT, function() {
  console.log('Listen on http://localhost:' + PORT + ' in ' + NODE_ENV);
});
