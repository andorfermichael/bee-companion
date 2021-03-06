cp /var/lib/jenkins/workspace/.env /var/lib/jenkins/workspace/BeeCompanionTask/.env
cd /var/lib/jenkins/workspace/BeeCompanionTask/
export NODE_ENV=test
export CHROME_BIN=/usr/bin/google-chrome
npm install
npm rebuild node-sass
npm run webdriver-manager update
sequelize --config config/dbconfig.js
sequelize db:migrate --env test
npm run api:prod:pm2
npm run build:prod
npm run server:prod:pm2

# Add the following commands to build step / shell script section to run this script on build
# cd deployment/
# sh jenkins.sh
# npm run ci:testall
