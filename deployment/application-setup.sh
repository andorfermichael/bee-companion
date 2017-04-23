#!/bin/bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
source ~/.bashrc
nvm install 7.4.0
nvm use 7.4.0
npm install -g pm2
npm install