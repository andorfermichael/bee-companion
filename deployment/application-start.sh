#!/bin/bash
npm install --production
cd ./server
pm2 start server.js
npm deploy