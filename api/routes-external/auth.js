const express = require('express');
const router = express.Router();

const request = require('request');
const rp = require('request-promise');

// Auth0 dependencies
const AuthenticationClient = require('auth0').AuthenticationClient;
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
let access_token;

const auth0BaseDomain = process.env.AUTH0_BASE_DOMAIN;

const auth0 = new AuthenticationClient({
  domain: auth0BaseDomain,
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
  algorithms: ['RS512']
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

function getJWTToken(req){
  const parts = req.headers.authorization.split(' ');
  if (parts.length == 2) {
    const scheme = parts[0];
    const credentials = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }
  return false;
}

// Get all users
router.get('/users', function(req, res) {
  const url = `${auth0BaseDomain}api/v2/users`;
  makeApiCall({ url: url }, (data) => { res.json(data); });
});

// Set the role of a user
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
      console.log(opts);
      makeApiCall(opts, (data) => { res.json(data); });
    });
  }
});

module.exports = router;
