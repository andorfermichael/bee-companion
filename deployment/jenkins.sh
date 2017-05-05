cp /var/lib/jenkins/workspace/.env /var/lib/jenkins/workspace/BeeCompanion/.env
cd /var/lib/jenkins/workspace/BeeCompanion/
export NODE_ENV=test
export CHROME_BIN=/usr/bin/chromium-browser
npm install
sequelize --config config/dbconfig.js
sequelize db:migrate --env test
npm run api:prod:pm2
npm run build:prod
npm run server:prod:pm2
docker run -p 127.0.0.1:5000:5000 --rm -it markadams/chromium-xvfb
npm run ci:testall
