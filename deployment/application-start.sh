#!/bin/bash
cd ./server
pm2 start server.js
cd ..
npm run build:prod
npm run server:prod:pm2