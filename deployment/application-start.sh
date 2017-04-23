#!/bin/bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
source ~/.bashrc
nvm install 7.4.0
nvm use 7.4.0
npm install -g pm2
cd /var/www/
npm install
cd ./server
pm2 start server.js
cd ..
npm run build:prod
npm run server:prod:pm2