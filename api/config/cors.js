const whitelist = [
  'localhost:3000',
  'http://localhost:3000',
  'https://localhost:3000',
  'localhost:8000',
  'http://localhost:8000',
  'https://localhost:8000',
  'bee-companion.com',
  'http://bee-companion.com',
  'https://bee-companion.com',
  'https://www.bee-companion.com',
  'http://localhost:8000/#/home/payment/approved',
  'http://localhost:8000/#/home/payment/cancelled',
   /(https?:\/\/(w+?\.)sandbox.paypal\.com(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/
];

const options = {
  /*origin: function (origin, callback) {
    console.log('#### origin at cors: ' + origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS: ' + origin))
    }
  },*/
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
  allowedHeaders: ['Accept', 'Content-Type', 'Authorization', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = options;
