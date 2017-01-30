/**
 * @author: @AngularClass
 */

const autoprefixer = require('autoprefixer');
// Look in ./config folder for webpack.dev.js
switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    module.exports = require('./config/webpack.prod')({postcss: [autoprefixer], env: 'production'});
    break;
  case 'test':
  case 'testing':
    module.exports = require('./config/webpack.test')({postcss: [autoprefixer], env: 'test'});
    break;
  case 'dev':
  case 'development':
  default:
    module.exports = require('./config/webpack.dev')({postcss: [autoprefixer], env: 'development'});
}
