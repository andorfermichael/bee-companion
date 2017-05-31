// Load environment variables
const dotenv = require('dotenv').config({path: '.env'});

module.exports = {
  development: {
    database: "beecompanion-development",
    host: "127.0.0.1",
    username: "admin",
    password: "root",
    dialect: "postgres"
  },
  test: {
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_NAME,
    host: process.env.DB_TEST_HOST,
    port: process.env.DB_TEST_PORT,
    dialect: "postgres"
  },
  production: {
    username: process.env.DB_PRODUCTION_USERNAME,
    password: process.env.DB_PRODUCTION_PASSWORD,
    database: process.env.DB_PRODUCTION_NAME,
    host: process.env.DB_PRODUCTION_HOST,
    port: process.env.DB_PRODUCTION_PORT,
    dialect: "postgres"
  }
};
