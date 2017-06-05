// Load environment variables
const dotenv = require('dotenv').config({path: '../.env'});

// Express and middleware
const express = require('express');
const raven = require('raven');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const crypto = require('crypto');
const setOrigin = require('./middlewares/setOrigin');

// Express App
const app = express();

// Env
const PORT     = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

raven.config('__DSN__').install();
// the request handler must be the first middleware on the app
app.use(raven.requestHandler());
// the error handler must be before any mother error middleware
app.use(raven.errorHandler());

// Config
app.use(bodyParser.json());
app.use(helmet()); // Use default helmet packages for better security
app.use(setOrigin);

// Use Referrer Policy for more privacy about origin
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

// Add content security policy rules here to prevent XSS attacks
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"]
  }
}));

// Routes
const user = require('./routes-external/user');
const auth = require('./routes-external/auth');
const paypal = require('./routes-external/paypal');
const paypalTransactions = require('./routes/paypaltransactions');

// Angular Http content type for POST etc defaults to text/plain at
app.use(bodyParser.text(), function ngHttpFix(req, res, next) {
  try {
    req.body = JSON.parse(req.body);
    next();
  } catch(e) {
    next();
  }
});

app.use('/api/paypal', paypal);
app.use('/api/auth', auth);
app.use('/api/paypaltransaction', paypalTransactions);
app.use('/api', user);

app.listen(PORT, function() {
  console.log('Listen on http://localhost:' + PORT + ' in ' + NODE_ENV);
});
