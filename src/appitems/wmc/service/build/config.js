(function() {
  module.exports = (function() {
    return {
      debug: false,
      server_port: 1080,
      monogo: 'mongodb://colee:z1x2c3@127.0.0.1:27017/',
      db_name: 'co_wmc',
      logs: {
        appenders: [
          {
            type: "console"
          }
        ],
        level: 'all'
      }
    };
  })();

}).call(this);
