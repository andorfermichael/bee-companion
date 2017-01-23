var app = require('./server/index.js');
var server = app.listen(4000, function() {
    console.log('Listening on port 4000');
});