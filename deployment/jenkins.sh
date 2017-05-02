cd /var/lib/jenkins/workspace/BeeCompanion/
npm install
sequelize --config config/dbconfig.js
sequelize db:migrate --env test
npm run api:prod:pm2
npm run build:prod
npm run server:prod:pm2
