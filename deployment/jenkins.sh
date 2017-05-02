cd /var/lib/jenkins/workspace/BeeCompanion/
npm install dotenv
npm install sequelize-cli
npm install sequelize
sequelize --config config/dbconfig.js
sequelize db:migrate --env test
npm install
npm run api:prod:pm2
npm run build:prod
npm run server:prod:pm2
