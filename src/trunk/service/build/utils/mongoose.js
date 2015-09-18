var connect, mongoose, mongooseQ, settings;

settings = require('../config');

mongoose = require('mongoose');

(connect = function() {
  mongoose.connect(settings.monogo + settings.db_name, {
    server: {
      poolSize: 5
    }
  });
  return mongoose.connection.on('error', function(err) {
    return console.log(err);
  });
})();

mongoose.connection.on('disconnected', function() {
  return connect();
});

mongooseQ = require('mongoose-q')(mongoose);

module.exports = mongoose;
