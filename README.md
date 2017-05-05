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
* [Configuration](#configuration)
* [AoT Don'ts](#aot-donts)
* [TypeScript](#typescript)
* [Deployment](#deployment)

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
* [Sequelize](http://docs.sequelizejs.com/en/v3/)
* [Testing](https://angular.io/docs/ts/latest/guide/testing.html)
  * [E2E](https://angular.github.io/protractor/#/faq#what-s-the-difference-between-karma-and-protractor-when-do-i-use-which-)
  * [Karma](https://karma-runner.github.io/)
  * [Protractor](https://angular.github.io/protractor/)
  * [Jasmine](https://github.com/jasmine/jasmine)
  * [Istanbul](https://github.com/gotwarlost/istanbul)
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
 │   ├──application-start.sh       * a shell script to install and run our application on production server
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

## Installing
* `npm install webpack-dev-server rimraf webpack sequelize sequelize-cli -g` to install required global dependencies
* `npm install` to install all dependencies

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

# Configuration
Configuration files live in `config/` we are currently using webpack, karma, and protractor for different stages of your application.

# AoT Don'ts
The following are some things that will make AoT compile fail.

- Don’t use require statements for your templates or styles, use styleUrls and templateUrls, the angular2-template-loader plugin will change it to require at build time.
- Don’t use default exports.
- Don’t use `form.controls.controlName`, use `form.get(‘controlName’)`
- Don’t use `control.errors?.someError`, use `control.hasError(‘someError’)`
- Don’t use functions in your providers, routes or declarations, export a function and then reference that function name.
- @Inputs, @Outputs, View or Content Child(ren), Hostbindings, and any field you use from the template or annotate for Angular should be public.


# TypeScript
> To take full advantage of TypeScript with autocomplete you would have to install it globally and use an editor with the correct TypeScript plugins.

## Use latest TypeScript compiler
TypeScript 2.1.x includes everything you need. Make sure to upgrade, even if you installed TypeScript previously.

```
npm install --global typescript
```

## Use a TypeScript-aware editor
We have good experience using these editors:

* [Visual Studio Code](https://code.visualstudio.com/)
* [Webstorm 10](https://www.jetbrains.com/webstorm/download/)
* [Atom](https://atom.io/) with [TypeScript plugin](https://atom.io/packages/atom-typescript)
* [Sublime Text](http://www.sublimetext.com/3) with [Typescript-Sublime-Plugin](https://github.com/Microsoft/Typescript-Sublime-plugin#installation)

### Visual Studio Code + Debugger for Chrome
> Install [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) and see docs for instructions to launch Chrome

The included `.vscode` automatically connects to the webpack development server on port `8000`.

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