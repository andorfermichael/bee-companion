# BeeCompanion

BeeCompanion is a platform for both beekeepers and their supporters.


# Table of Contents
* [Supported Tools](#supported-tools)
* [File Structure](#file-structure)
* [Getting Started](#getting-started)
    * [Dependencies](#dependencies)
    * [Installing](#installing)
    * [Database](#database)
    * [Running the app](#running-the-app)
* [Deployment](#deployment)
* [Security](#security)
  * [General](#general)
  * [Angular](#angular)
  * [Express](#express)
* [Performance](#performance)
  * [Angular](#angular)
  * [Express](#express)
* [Authors](#authors)
* [License](#license)

## Supported Tools
This project is based on [Angular2 Webpack Starter](https://github.com/AngularClass/angular2-webpack-starter) from [AngularClass](https://github.com/AngularClass). 

It supports:
* [Angular 4](https://angular.io)
  * [Ahead of Time Compile](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html)
  * [Forms](https://angular.io/docs/ts/latest/guide/forms.html)
  * [Http](https://angular.io/docs/ts/latest/guide/server-communication.html)
  * [Router](https://angular.io/docs/ts/latest/guide/router.html) 
  * [Services](https://gist.github.com/gdi2290/634101fec1671ee12b3e#_follow_@AngularClass_on_twitter) 
* [Codelyzer](https://github.com/mgechev/codelyzer)
* [Dotenv](https://github.com/motdotla/dotenv)
* [ExpressJS](http://expressjs.com/)
  * [BodyParser](https://github.com/expressjs/body-parser)
  * [Cors](https://github.com/expressjs/cors)
  * [Helmet](https://helmetjs.github.io/)
* [Sequelize](http://docs.sequelizejs.com/en/v3/)
* [Testing](https://angular.io/docs/ts/latest/guide/testing.html)
  * [E2E](https://angular.github.io/protractor/#/faq#what-s-the-difference-between-karma-and-protractor-when-do-i-use-which-)
  * [Istanbul](https://github.com/gotwarlost/istanbul)
  * [Jasmine](https://github.com/jasmine/jasmine)
  * [Karma](https://karma-runner.github.io/)
  * [Protractor](https://angular.github.io/protractor/)
* [TypeScript](http://www.typescriptlang.org/)
* [@types](https://www.npmjs.com/~types)
* [TsLint](http://palantir.github.io/tslint/)
* [PM2](http://pm2.keymetrics.io/)
* [Webpack 2](http://webpack.github.io/)
  * [Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement-with-webpack.html)


## File Structure
We use the component approach in our project. This is the new standard for developing Angular apps and a great way to ensure maintainable code by encapsulation of our behavior logic. A component is basically a self contained app usually in a single file or a folder with each concern as a file: style, template, specs, e2e, and component class. Here's how it looks (overview):
```
bee-companion/
 ├──api/                           * our API
 │   ├──config                     * our API configuration
 │   ├──migrations                 * sequelize migrations
 │   ├──models                     * our API models
 │   ├──routes                     * our API routes
 │   ├──routes-external            * our API routes to external services
 │   ├──seeders                    * database seeds
 │   └──api.js                     * entry point of our API
 │
 ├──config/                        * our configuration
 │   ├──dbconfig.js                * our database configuration
 │   ├──font-awesome.config.js     * font-awesome configuration
 │   ├──head-config.common.js      * header tags injected into html
 │   ├──helpers.js                 * helper functions for our configuration files
 │   ├──karma.conf.js              * karma config for our unit tests
 │   ├──protractor.conf.js         * protractor config for our end-to-end tests
 │   ├──spec-bundle.js             * ignore this magic that sets up our Angular testing environment
 │   ├──webpack.dev.js             * our development webpack config
 │   ├──webpack.prod.js            * our production webpack config
 │   └──webpack.test.js            * our testing webpack config
 │
 ├──deployment/                    * deployment scripts and configurations
 │   ├──application-start.sh       * a shell script to install and run our application on prod server
 │   └──jenkins.sh                 * a shell script to install, run and test our application on Jenkins
 │
 ├──src/                           * our source files that will be compiled to javascript
 │   ├──main.browser.ts            * our entry file for our browser environment
 │   │
 │   ├──index.html                 * Index.html: where we generate our index page
 │   │
 │   ├──polyfills.ts               * our polyfills file
 │   │
 │   ├──app/                       * WebApp: folder
 │   │   ├──app.component.spec.ts  * a simple test of components in app.component.ts
 │   │   ├──app.e2e.ts             * a simple end-to-end test for /
 │   │   └──app.component.ts       * a simple version of our App component components
 │   │
 │   └──assets/                    * static assets are served here
 │       ├──icon/                  * our list of icons from www.favicon-generator.org
 │       ├──service-worker.js      * ignore this. Web App service worker that's not complete yet
 │       ├──robots.txt             * for search engines to crawl your website
 │       └──humans.txt             * for humans to know who the developers are
 │
 │
 ├──.bootstraprc                   * Bootstrap config
 ├──.sequelizerc                   * Sequelize ORM config
 ├──appspec.yml                    * Amazon Web Services configuration for CD/CI
 ├──package.json                   * what npm uses to manage it's dependencies
 ├──tsconfig.json                  * typescript config used outside webpack
 ├──tsconfig.webpack.json          * config that webpack uses for typescript
 ├──tslint.json                    * typescript lint config
 ├──typedoc.json                   * typescript documentation generator
 └──webpack.config.js              * webpack main configuration file

```

# Getting Started
## Dependencies
What you need to run this app:
* `node` and `npm`
* Ensure you're running the latest versions Node `v6.x.x`+ (or `v7.x.x`) and NPM `3.x.x`+

> If you have `nvm` installed, which is highly recommended (`brew install nvm`) you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS. You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file)

Once you have those, you should install these globals with `npm install --global`:
* `webpack` (`npm install --global webpack`)
* `webpack-dev-server` (`npm install --global webpack-dev-server`)
* `karma` (`npm install --global karma-cli`)
* `protractor` (`npm install --global protractor`)
* `typescript` (`npm install --global typescript`)
* `sequelize-cli` (`npm install --global sequelize-cli`)
* `npm-check` (`npm install --global npm-check`)
* `nsp` (`npm install --global nsp`)

## Installing
* `npm install` to install all local dependencies

## Database
BeeCompanion uses Sequelize ORM for database requests via API. The database configuration is placed at `config/dbconfig.js`.
For development we recommend to create a postgresql database named `beecompanion-development`.

### migrate
```bash
# development
sequelize db:migrate --env development

# test
sequelize db:migrate --env test

# production
sequelize db:migrate --env production
```

## Running the app
After you have installed all dependencies you can now run the app. Run `npm run server:dev` to start a local server using `webpack-dev-server` which will watch, build (in-memory), and reload for you. The port will be displayed to you as `http://0.0.0.0:8000`. Additionally, run `npm run api:dev` to start the API. The port will be displayed to you as `http://0.0.0.0:3000`.

### server
```bash
# development
npm run server:dev

# production
npm run build:prod
npm run server:prod

# production using pm2 (living forever)
npm run build:prod
npm run server:prod:pm2
```

### api
```bash
# development
npm run api:dev

# production
npm run api:prod

# production using pm2 (living forever)
npm run api:prod:pm2
```

## Other commands

### build files
```bash
# development
npm run build:dev

# production (jit)
npm run build:prod

# AoT
npm run build:aot
```

### hot module replacement
```bash
npm run server:dev:hmr
```

### watch and build files
```bash
npm run watch
```

### run unit tests
```bash
npm run test
```

### watch and run our tests
```bash
npm run watch:test
```

### run end-to-end tests
```bash
# update Webdriver (optional, done automatically by postinstall script)
npm run webdriver:update

# this will start a test server and launch Protractor
npm run e2e
```

### continuous integration (run unit tests and e2e tests together)
```bash
# this will test both your JIT and AoT builds
npm run ci:testall
```

### run Protractor's elementExplorer (for end-to-end)
```bash
npm run e2e:live
```

# Deployment

BeeCompanion uses [AWS Codepipeline](https://aws.amazon.com/de/codepipeline/) and [Jenkins](https://jenkins.io/) for CD/CI.

The pipeline perodically polls this repository for changes, if something has changed the project is send to Jenkins
where the project is built, run and tested. If all tests have been passed, the project is deployed to the production server.

The configuration for this process is spread over the following files:
* `appspec.yml` contains the deployment configuration
* `deployment/application-start.sh` contains the install and build commands for the deployment
* `deployment/jenkins.sh contains` the install, build and test commands for Jenkins

Environment variables for both test and production are loaded by [Dotenv](https://github.com/motdotla/dotenv). 
For that reason, a `.env` file which declares those variables is placed in the root directory of the project
(deployment and Jenkins).
It is important that not only those files but also the sample.env (root of this repository) are kept up-to-date.
The update of those files must be done before releasing any changes, otherwise the deployment will fail.

# Security
## General
* Be aware of [OWASP Top 10](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project#tab=Main)
* Keep servers up-to-date
* Keep packages up-to-date and secure
  * run `npm-check` to get an overview about the up-to-dateness of the installed packages 
  (see [npm-check](https://github.com/dylang/npm-check) for more details)
  * run `nsp check` to get information about security vulnerabilities in any of the installed packages
   (see [nsp](https://github.com/nodesecurity/nsp) for more details)
* Be careful with sensitive data (company data and user data)
* Keep in mind that security is more important than any new feature

## Angular (Frontend)
Angular already handles most security problems by default, for example, Angular treats all values as
untrusted by default. However, it is important to follow Angular's best practices and to keep frontend
security in mind in all stages of development. Please inform yourself regularly about the latest
security recommendations of Angular which can be found in Angular's Guide [Security Section](https://angular.io/docs/ts/latest/guide/security.html).

Be aware that you must not include any sensitive information (e. g. credentials, API keys, etc.) directly in typescript.
Instead, include them via `config/webpack.dev.js` / `config/webpack.prod.js` / `config/webpack.test.js`.  

How does that work:
1. Add the value to `.env` in the project's root (do not forget to update sample.env too)
2. Create a new constant and read the value from process environment under Webpack Constants section
 in `config/webpack.env.js`, for example, `const MY_SECRET_VARIABLE = process.env.MY_SECRET_VARIABLE;`
3. Add an entry to const METADATA which can be found directly under Webpack Constants section,
for example, `MY_SECRET_VARIABLE: MY_SECRET_VARIABLE`
4. Go to plugins section and search for `new DefinePlugin`, and add a new entry to `process.env`,
for example, `MY_SECRET_VARIABLE': JSON.stringify(MY_SECRET_VARIABLE)`
5. Go to `src/app/custom-typings.d.ts` and add a new entry
`declare var MY_SECRET_VARIABLE: string;`
6. Add a new entry to interface GlobalEnvironment `MY_SECRET_VARIABLE: string;`


All variables defined in `.env` are then loaded as environment variables
by [Dotenv](https://github.com/motdotla/dotenv) and are accessible in
TypeScript via `process.env.MY_SECRET_VARIABLE`.

## Express (Backend)
There are several security aspects which have to be kept in mind during
development, plus several security concepts which have already been implemented:

* The [Helmet](https://github.com/helmetjs/helmet) packages has been integrated
into our API. It comes along with several security concepts (HTTP Security Headers), some are enabled by default,
while some have to be activated and configured manually. It is important to
always trade of the benefits against the drawbacks of each component.
We decided to additionally activate *HTTP Public Key Pinning*, *referrerPolicy* and *contentSecurityPolicy*
to prevent man-in-the-middle attacks, to increase privacy, and to prevent XSS attacks.
* Avoid to use `bodyParser.urlencoded` if not necessary, meaning API does not
get any content other than JSON. `bodyParser.urlencoded` enables CSRF attacks
if no CSRF token is used on each request. For more info see [Dangerous Use of Express Body-Parser](https://fosterelli.co/dangerous-use-of-express-body-parser.html)
* The [Cors](https://github.com/expressjs/cors) package has been integrated into our API.
It enables us to do Cross Origin Request Sharing. It is important to keep some points in mind:
  * Do not enable cors for each route, instead enable it only for those 
  routes which have need of cors. This can be done with `router.use('/route', cors(corsConfig));`
  * Only allow specific origins by declaring them using the whitelist in `api/config/cors.js`
  * Only allow methods, allow headers and credentials if needed in `api/config/cors.js`
* If sessions are needed use either [Express-Session](https://github.com/expressjs/session)
or [Cookie-Session](https://github.com/expressjs/cookie-session) depending on the use case. Both
packages are developed and maintained by [ExpressJS](https://github.com/expressjs)
so do not use other packages for session handling. Additionally, it is important to correctly configure the session:
  * Do not use the default session name
  * Set HttpOnly property to true to ensure the cookie cannot be
  read by JavaScript
  * Set Secure property to true to ensure that the cookie is only
  send via HTTPS
  * Set the expire property to a date in the near future (a cookie should only live as long as necessary)
  * Set domain and sameSite properties if possible
  
For further security best practices according to ExpressJS have a look at the following resources:
* [ExpressJS - Production Best Practices: Security](http://expressjs.com/en/advanced/best-practice-security.html)
* [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
* [SNYK Vulnerability DB](https://snyk.io/vuln)

# Performance
## Angular (Frontend)
For frontend performance we recommend to follow [Angular Deployment Guide](https://angular.io/docs/ts/latest/guide/deployment.html).
Especially, the AoT section may be of highest interest.

For AoT there are additional recommendations:
* Don’t use require statements for your templates or styles, use styleUrls and templateUrls, the angular2-template-loader plugin will change it to require at build time.
* Don’t use default exports.
* Don’t use `form.controls.controlName`, use `form.get(‘controlName’)`
* Don’t use `control.errors?.someError`, use `control.hasError(‘someError’)`
* Don’t use functions in your providers, routes or declarations, export a function and then reference that function name.
* @Inputs, @Outputs, View or Content Child(ren), Hostbindings, and any field you use from the template or annotate for Angular should be public.

## Express (Backend)
For backend performance we recommend to follow 
[ExpressJS - Production best practices: performance and reliability](http://expressjs.com/en/advanced/best-practice-performance.html).

# Authors

- [Michael Andorfer](mailto:mandorfer.mmt-b2014@fh-salzburg.ac.at)
- [Nico Deufemia](mailto:ndeufemia.mmt-b2014@fh-salzburg.ac.at)

# License

The project is currently under development and underlies the copyright law.