cp /var/lib/jenkins/workspace/.env /var/lib/jenkins/workspace/BeeCompanion/.env
cd /var/lib/jenkins/workspace/BeeCompanion/
export NODE_ENV=test
npm install
sequelize --config config/dbconfig.js
sequelize db:migrate --env test
npm run api:prod:pm2
npm run build:prod
npm run server:prod:pm2
docker run -p 127.0.0.1:5000:5000 --rm -it -v "$PWD":/ markadams/chromium-xvfb npm run ci:testall
npm run ci:testall
