// Express
const express = require('express');
const history = require('connect-history-api-fallback');
const morgan  = require('morgan');
const bodyParser = require('body-parser');
const request = require("request");
const rp = require('request-promise');

// Auth0 dependencies
const AuthenticationClient = require('auth0').AuthenticationClient;
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
let access_token;

const auth0 = new AuthenticationClient({
  domain: 'bee-companion.eu.auth0.com',
  clientId: 'GYa4pWTXDi17cBIf8bDtaFhTS1LiJwGr'
});
// {
//   "access_token": "eyJ...Ggg",
//   "expires_in": 86400,
//   "scope": "read:clients create:clients read:client_keys",
//   "token_type": "Bearer"
// }

const beekeepers = require('./routes/beekeepers');

// Express App
const app = express();

// Env
const PORT     = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Authentication middleware. When used, the
// access token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and 
  // the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://bee-companion.eu.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer. (BeeCompanion)
  audience: 'GYa4pWTXDi17cBIf8bDtaFhTS1LiJwGr',
  issuer: `https://bee-companion.eu.auth0.com/`,
  algorithms: ['RS256']
});

// Angular Http content type for POST etc defaults to text/plain at
app.use(bodyParser.text(), function ngHttpFix(req, res, next) {
  try {
    req.body = JSON.parse(req.body);
    next();
  } catch(e) {
    next();
  }
});

// Authentication middleware. When used, the
// access token must exist and be verified against
// the Auth0 JSON Web Key Set

const authOptions = { method: 'POST',
  url: 'https://bee-companion.eu.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: 
   { grant_type: 'client_credentials',
     client_id: '5HvyCPjCe75nZi43rfQ7B53b1v3tvBM2',
     client_secret: 'd9EBicpcgizDe-F995-lCupvhgvZtTT5SuGznq5L5uGeTTBoMjmXBsGOFunyPYFt',
     audience: 'https://bee-companion.eu.auth0.com/api/v2/' },
  json: true };

/**
* @method makeApiCall
* @param {Object} options - an object with minimum options.url set, optional options.body
* @param {requestCallback} callback - The callback that handles the response.
* @return void
*/
function makeApiCall(options, callback) {
  if (access_token && access_token.expiration) {
    if (new Date() > access_token.expiration) {
       rp(authOptions)
        .then((token) => { callApi(token, options, callback) })
        .then((data) => callback)
        .catch((error) => { console.log(error); });
      return;
    } else {
      callApi(access_token, options, callback);
    }
  }
  rp(authOptions)
        .then((token) => { callApi(token, options, callback) })
        .then((data) => callback)
        .catch((error) => { console.log(error); });
}

function callApi(token, options, callback) {
  return rp(getApiOpts(token, options)).then((data) => { callback(data);});
}

/**
* @method getApiOpts
* @param {Object} data - contains token related data
* @param {Object} options - an object with minimum options.url set, optional options.body
* @return {Object}
*/
function getApiOpts(data, options) {
  const tmp = { 
    method: 'PATCH',
    url: options.url,
    headers: { 
      authorization: data.token_type + ' ' + data.access_token,
      'content-type': 'application/json'
    },
    json: true
  };
  if (options.body) {
    tmp.body = options.body;
  }
  return tmp;
}

function getRoleChangeOpts(role, user_id) {
  return {
    url: 'https://bee-companion.eu.auth0.com/api/v2/users/' + encodeURIComponent(user_id),
    body: {
      app_metadata: {
        roles: [
          role.toString()
        ]
      }
    }
  };
}

function getJWTToken(req){
  var parts = req.headers.authorization.split(' ');
  if (parts.length == 2) {
    var scheme = parts[0];
    var credentials = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }
  return false;
}


app.get('/api/users', function(req, res) {
  const url = 'https://bee-companion.eu.auth0.com/api/v2/users';
  makeApiCall({ url: url }, (data) => { res.json(data); });
});

app.get('/api/user/set/role/:role', checkJwt, function(req, res) {
  const role = req.params.role;
  if (!role || (role !== 'Supporter' && role !== 'Beekeeper')) {
    return res.status(403);
  } 
  else {
    jwtToken = getJWTToken(req);
    auth0.tokens.getInfo(jwtToken, function(err, userInfo){
        const userRoles = userInfo.roles || userInfo.app_metadata.roles;
        if (userRoles.indexOf(role) > 1) {
          return res.status(400).json({'error':'User has already this role!'});
        }
        const opts = getRoleChangeOpts(role, userInfo.user_id);
        console.log(opts);
        makeApiCall(opts, (data) => { res.json(data); });
    });
  }
});

app.listen(PORT, function() {
  console.log('Listen on http://localhost:' + PORT + ' in ' + NODE_ENV);
});
