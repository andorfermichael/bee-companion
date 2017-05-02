npm install
sequelize db:migrate --env test
npm run api:prod:pm2
npm run build:prod
npm run server:prod:pm2
