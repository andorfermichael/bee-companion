cp /var/lib/jenkins/workspace/.env /var/lib/jenkins/workspace/BeeCompanion/.env
cd /var/lib/jenkins/workspace/BeeCompanion/
export NODE_ENV=test
export CHROME_BIN=/usr/bin/google-chrome
npm install
sequelize --config config/dbconfig.js
sequelize db:migrate --env test
npm run api:prod:pm2
npm run build:prod
npm run server:prod:pm2
npm run ci:testall
