#!/bin/bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
source ~/.bashrc
nvm install 7.4.0
nvm use 7.4.0
npm install -g pm2
cd /var/www/beecompanion/
npm install http-server
npm install
npm install sequelize-cli -g
npm install pg -g
sequelize --config config/dbconfig.js
sequelize db:migrate --env production
pm2 kill
export NODE_ENV=production
npm run api:prod:pm2
npm run server:prod:pm2
