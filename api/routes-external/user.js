const express = require('express');
const router = express.Router();
const cors = require('cors');
const corsConfig = require('../config/cors');
const models  = require('../models');

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
  fields: 'username,picture,nickname,app_metadata,user_metadata,roles',
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

function buildColumnFilterBasedOnScope(scope, privacyRules) {
  const scopes = ['public', 'registered', 'donators', 'private'];
  const filtered = _.pickBy(privacyRules, function(value, key) {
    if (scopes.indexOf(scope) >= scopes.indexOf(value)) {
      return true;
    } 
    return false;
  });
  return Object.keys(filtered);
}

// Get all users from auth0
router.use('/users', cors(corsConfig));
router.get('/users', function(req, res) {
  const url = `${auth0BaseDomain}api/v2/users`;
  makeApiCall({ url: url }, (data) => { res.json(data); });
});

// Get specific user (only public data -> currently achieved by setting include_fields)
// Get specific user (only public data -> currently achieved by setting include_fields)
router.use('/user/:id', cors(corsConfig));
router.get('/user/:id', function(req, res) {
  models.User.findOne({ 
    where: { 
      $or: [
      {
        username: {
          $eq: req.params.id
        }
      },
      {
        auth_user_id: {
          $eq: req.params.id
        }
      }]
    }
  }).then((user) => {
      user.getUserPrivacy()
        .then((userPrivacy) => {
          const privacy = userPrivacy.get({plain: true});
          const data = user.get({plain: true});
          const filter = buildColumnFilterBasedOnScope('public', privacy);
          res.json(_.pick(data, filter));
        })
    })
    .catch((err) => {
        res.status(404).json({error: 'User not found!'});
    });
});

module.exports = router;
