#!/bin/bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
source ~/.bashrc
nvm install 7.4.0
nvm use 7.4.0
export NODE_ENV=production
npm install -g pm2
cd /var/www/beecompanion/
npm install http-server
npm install
sequelize --config config/dbconfig.js
sequelize db:migrate --env production
pm2 kill
npm run api:prod:pm2
npm run server:prod:pm2
