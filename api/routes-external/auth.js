const express = require('express');
const router = express.Router();
const cors = require('cors');
const corsConfig = require('../config/cors');

const _ = require('lodash');
const rp = require('request-promise');

// Auth0 dependencies
const AuthenticationClient = require('auth0').AuthenticationClient;
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
let access_token;

const auth0BaseDomain = process.env.AUTH0_BASE_DOMAIN;

const auth0 = new AuthenticationClient({
  domain: process.env.AUTH0_BASE_DOMAIN_ONLY,
  clientId: process.env.AUTH0_CLIENT_ID
});

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
    jwksUri: `${auth0BaseDomain}.well-known/jwks.json`
  }),

  // Validate the audience and the issuer. (BeeCompanion)
  audience: process.env.AUTH0_CLIENT_ID,
  issuer: auth0BaseDomain,
  algorithms: ['RS256']
});

// Authentication middleware. When used, the
// access token must exist and be verified against
// the Auth0 JSON Web Key Set
const authOptions = { method: 'POST',
  url: `${auth0BaseDomain}oauth/token`,
  headers: { 'content-type': 'application/json' },
  body:
    { grant_type: 'client_credentials',
      client_id: process.env.AUTH0_API_CLIENT_ID,
      client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: `${auth0BaseDomain}api/v2/`
    },
  json: true
};

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
    method: options.method || 'PATCH',
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
    url: `${auth0BaseDomain}api/v2/users/` + encodeURIComponent(user_id),
    body: {
      app_metadata: {
        roles: [
          role.toString()
        ]
      }
    }
  };
}

function getSignupOpts(data) {
  return _.assign({}, authOptions, {
    url: `${auth0BaseDomain}dbconnections/signup`,
    body: {
      email: _.get(data, 'email'),
      password: _.get(data, 'password'),
      username: _.get(data, 'userName') || _.get(data, 'username'),
      user_metadata: {
        firstName: _.get(data, 'firstName'),
        lastName: _.get(data, 'lastName')
      },
      connection: 'Username-Password-Authentication'
    }
  });
}

function getJWTToken(req){
  const parts = req.headers.authorization.split(' ');
  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }
  return false;
}

const defaultUserQueryParamters = {
  fields: 'email,username,picture,nickname,last_login,app_metadata,user_metadata,user_id',
  include_fields: true
};

function buildQueryString(queryParams) {
  const options = _.assign({}, defaultUserQueryParamters, queryParams);
  let query = [];
  const paramLength = Object.keys(options).length;
  _.forOwn(options, (value, key) => {
    query.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  })
  return `?${query.join('&')}`;
}

// Get specific user (only public data -> currently achieved by setting include_fields)
router.use('/user/:id', cors(corsConfig));
router.get('/user/:id', function(req, res) {
  const queryParams = { q: `nickname:"${req.params.id}"`};
  const url = `${auth0BaseDomain}api/v2/users${buildQueryString(queryParams)}`;
  const method = 'GET';
  console.log({url, method});
  makeApiCall({ method, url }, (data) => { res.json(data); });
});

// Get all users
// moved to user.js

// Set the role of a user
router.use('/user/set/role/:role', cors(corsConfig));
router.get('/user/set/role/:role', checkJwt, function(req, res) {
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
      makeApiCall(opts, (data) => { res.json(data); });
    });
  }
});

// Create a new user
router.use('/user/create', cors(corsConfig));
router.post('/user/create', cors(), function(req, res) {
  models.User.create({
    firstName: req.body,
    lastName: req.body,
    userName:req.body,
    role:req.body,
    picture:req.body,
    email:req.body,
    paypalId:req.body,
    phone:req.body,
    authenticated:req.body,
    verified:req.body,
    street:req.body,
    streetNumber:req.body,
    postalCode:req.body,
    city:req.body,
    country:req.body
  }).then(function(user) {
    res.json(user);
  });
});

// Enabling CORS Pre-Flight 
router.options('/signup', cors(corsConfig));
router.use('/signup', cors(corsConfig));

// Signup Process
router.post('/signup', function(req, res) {
  const userdata = _.get(req, 'body.user');
  const opts = getSignupOpts(userdata);
  rp(opts)
    .then((data) => { res.json(data); })
    .catch((error) => {
      res.status(400).json({ error }); });
});

module.exports = router;
