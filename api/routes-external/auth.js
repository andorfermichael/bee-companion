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

// Get specific user (only public data -> currently achieved by setting include_fields)
router.use('/user/:id', cors(corsConfig));
router.get('/user/:id', function(req, res) {
  jwtToken = getJWTToken(req);
  auth0.tokens.getInfo(jwtToken, function(err, userInfo) {
    if (req.params.id == 'me' || req.params.id == userInfo.username) {
      //collect data from calling user itself
      const user_id = userInfo.user_id;
      models.User.findOne({ where: { auth_user_id: user_id }})
        .then((user) => {
          user.getUserPrivacy()
            .then((userPrivacy) => {
              const data = _.assign({}, userInfo, user.get({plain: true}), { privacy: userPrivacy.get({plain: true})});
              res.json(data);
            })
        })
        .catch((err) => {
            // user was registered on auth0 but is not present in usermodel
            models.User.create({
              auth_user_id: userInfo.user_id || user_id,
              given_name: userInfo.given_name || _.get(userInfo, 'user_metadata.firstName'),
              family_name: userInfo.family_name || _.get(userInfo, 'user_metadata.lastName'),
              username: userInfo.username,
              description: userInfo.description,
              interests: userInfo.interests,
              birthday: userInfo.birthday,
              role: _.get(userInfo.roles, '[0]') || _.get(userInfo, 'app_metadata.roles[0]') || role,
              gender: userInfo.gender,
              picture: userInfo.picture,
              email: userInfo.email,
              paypal: userInfo.paypal,
              phone: userInfo.phone,
              authenticated: userInfo.authenticated || false,
              email_verified: userInfo.email_verified,
              street: userInfo.street,
              street_number: userInfo.street_number,
              postal_code: userInfo.postal_code,
              city: userInfo.city,
              country: userInfo.country
            }, {
              include: [{
                association: models.UserPrivacy.User,
                include: [ models.User.Privacy ]
              }]
            }).then(function(user) {
                // create UserPrivacy default Dataset
                models.UserPrivacy.create({
                  UserId: user.id
                 }).then(function(userPrivacy) {

                  const userData = _.pick(user.get({plain: true}), userColumnFilter);
                  userData.privacy = userPrivacy.get({plain: true});
                  res.json(userData);
                 }).catch((error) => {
                  console.log(error);
                    res.status(400).json(error);
                 });
            });
        });
    }
    else {
      // fallback because username is not settable on auth0
      // lookup in our database for username:
      models.User.findOne({ where: { username: req.params.id }})
        .then((user) => {
          user.getUserPrivacy()
            .then((userPrivacy) => {
              const data = _.assign({}, user.get({plain: true}), { privacy: userPrivacy.get({plain: true})});
              res.json(data);
            })
            .catch((error) => {
              const queryParams = { q: `username:"${req.params.id}"`};
              const url = `${auth0BaseDomain}api/v2/users${buildQueryString(queryParams)}`;
              const method = 'GET';
              makeApiCall({ method, url }, (userData) => {
                const user_id = _.get(userData, '[0].user_id');
                if (user_id) {
                  userData = userData[0];
                  models.User.findOne({ where: { auth_user_id: user_id }})
                  .then((user) => {
                    user.getUserPrivacy()
                      .then((userPrivacy) => {
                        const privacy = userPrivacy.get({plain: true});
                        const data = _.assign({}, userData, user.get({plain: true}));
                        res.json(_.pick(data, buildColumnFilterBasedOnScope('registered', privacy)));
                      })
                      .catch((error) => {
                        res.status(400).json(error);
                      })
                  });
                } else {
                  res.status(404).json({error: 'User not found!'});
                }           
              });
            });  
        });  
    }
  });
});


// Get all users
// moved to user.js

// get userPrivacy
router.use('/user/:id/userPrivacy/', cors(corsConfig));
router.get('/user/:id/userPrivacy/', checkJwt, function(req, res) {
    jwtToken = getJWTToken(req);
    auth0.tokens.getInfo(jwtToken, function(err, userInfo){
      const user_id = userInfo.user_id;
      models.User.findOne({ where: { auth_user_id: user_id }})
        .then((user) => {
          user.getUserPrivacy()
            .then((userPrivacy) => {
              res.json(userPrivacy.get({plain: true}));
            })
        });
    });
});


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
      const user_id = userInfo.id;
      if (userRoles.indexOf(role) >= 0) {
        return res.status(400).json({'error':'User has already this role!'});
      }
      const opts = getRoleChangeOpts(role, userInfo.user_id);
      makeApiCall(opts, (data) => {
        // create User
        models.User.create({
          auth_user_id: data.user_id || user_id,
          given_name: data.given_name,
          family_name: data.family_name,
          username: data.username,
          description: data.description,
          interests: data.interests,
          birthday: data.birthday,
          role: _.get(data.roles, '[0]') || _.get(data, 'app_metadata.roles[0]') || role,
          gender: data.gender,
          picture: data.picture,
          email: data.email,
          paypal: data.paypal,
          phone: data.phone,
          authenticated: data.authenticated || false,
          email_verified: data.email_verified,
          street: data.street,
          street_number: data.street_number,
          postal_code: data.postal_code,
          city: data.city,
          country: data.country
        }, {
          include: [{
            association: models.UserPrivacy.User,
            include: [ models.User.Privacy ]
          }]
        }).then(function(user) {
            // create UserPrivacy default Dataset
            models.UserPrivacy.create({
              UserId: user.id
             }).then(function(userPrivacy) {
              res.json(userPrivacy);
             }).catch((error) => {
              console.log(error);
                res.status(400).json(error);
             });
        });
      });
    });
  }
});

function getUserDiff(a, b) {
  // only one level deep, no performance issue ;)
  return _.reduce(a, function(result, value, key) {
      return _.isEqual(value, b[key]) ?
          result : result.concat(key);
  }, []);
}

function createProfileUpdateBuzzFeed(trigger, user, diff) {
  console.log(diff);
  _.forOwn(diff, (val, key) => { _.set(diff, key, _.get(columnNameMap, val, val.replace('_', ' ')))});
  var message = _.get(user, 'first_name') || _.get(user, 'username');
  message = message.charAt(0).toUpperCase() + message.slice(1);
  message += ' has just now updated ';
  message += _.get(user, 'gender') === 'female' ? 'her' : (_.get(user, 'gender') === 'male' ? 'his' : 'his/her');
  message += ' Profile. ' + diff.length ? (diff.join(', ') + (diff.length > 1 ? ' are' : ' is ') + ' now uptodate.') : '';
  return {
    UserId: user.id,
    trigger: 'Profile Update',
    message: message,
    resource: '/user/' + _.get(user, 'username'),
    published: false,
    likes: 0,
    scope: 'public',
    archived: false
  };
}

function saveBuzz(buzz) {
  return models.Buzz.create(
    buzz
  )
}

function appendBuzzToUser(user, buzz) {
  _.set(user, 'buzzes', _.get(user, 'buzzes', []).push(buzz));
  return user;
}
    
const userColumnFilter = ['given_name','family_name','username','description',
  'interests','birthday','role','gender','picture','email','paypal','phone','street',
  'street_number','postal_code','city','country'];

const columnNameMap = {
  given_name: 'First name',
  family_name: 'family name'
};

const auth0ColumnFilter = ['email' ];

// Update a user
router.use('/user/:id/update', cors(corsConfig));
router.post('/user/:id/update', cors(), function(req, res) {
  const preventBuzzFlag = _.get(req.body, 'preventBuzzFlag');
  const newUserData = _.pick(req.body, userColumnFilter);
  const newPrivacyData = req.body.privacy;
  jwtToken = getJWTToken(req);
  // get user_id out of JWT
    auth0.tokens.getInfo(jwtToken, function(err, userInfo){
      // now we have the userInfo / user_id
      const user_id = userInfo.user_id;
      // get user from model
      models.User.findOne({ where: { auth_user_id: user_id }})
        .then((user) => {
          // filter fields and update with new data
          const newUser = _.assign({}, _.pick(user.get({plain: true}), userColumnFilter), newUserData);
          models.User.update(newUser, {where: { auth_user_id: user_id}})
            .then((updatedUser) => {
              // filter fields again for submit to auth0 
              // NOT SUPPORTET <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>
              // const url = `${auth0BaseDomain}api/v2/users/` + encodeURIComponent(user_id);
              // const opts = { url: url, body: _.pick(newUser, auth0ColumnFilter)};
              // makeApiCall(opts, (data) => {
              //   console.log(data);
              //   //save changes from auth0 back to model
              //   res.json(data);
              // });
              models.UserPrivacy.update(newPrivacyData, { where: { UserId: user.id }})
              .then((updatedPrivacy) => {
                  const diff = getUserDiff(newUserData, user.get({plain: true}));
                  saveBuzz(createProfileUpdateBuzzFeed('Profile Update', user.get({plain: true}), diff))
                    .then((data) => {
                      res.status(200).json(appendBuzzToUser(newUser,data));
                    })                  
                });
            })
            .catch((err) => {
              if (_.get(err, 'original.constraint') === 'Users_username_key') {
                res.status(400).json({error: 'This username is already taken!', code: 'usernameTaken'});
              } else {
                res.status(400).json({error: 'An error ocurred while saving data!', code: 'general'});
              }
            })
        });
    });
});

// create a userPrivacy Dataset
router.use('/userPrivacy/create', cors(corsConfig));
router.post('/userPrivacy/create', cors(), function(req, res) {
  jwtToken = getJWTToken(req);
    auth0.tokens.getInfo(jwtToken, function(err, userInfo){
      const user_id = userInfo.user_id;
      models.User.findOne({ where: { auth_user_id: user_id }})
        .then((user) => {
          models.UserPrivacy.create({id: user.id})
            .then(function(userPrivacy) {
              res.json(userPrivacy.get({plain: true}));
            }).catch((error) => {
              res.status(400).json(error);
            })
        });
    });
});

module.exports = router;


// Create a new user
router.use('/user/create', cors(corsConfig));
router.post('/user/create', cors(), function(req, res) {
  models.User.create(_.pick(req.body, userColumnFilter)).then(function(user) {
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
