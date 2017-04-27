#!/bin/bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
source ~/.bashrc
nvm install 7.4.0
nvm use 7.4.0
export NODE_ENV=production
npm install -g pm2
pm2 kill
cd /var/www/beecompanion/
npm install
npm install http-server
cd /var/www/beecompanion/api/
pm2 start api.js
cd /var/www/beecompanion/
npm run server:prod:pm2