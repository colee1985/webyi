module.exports = (function() {
  return {
    debug: true,
    server_port: 1081,
    monogo: 'mongodb://colee:z1x2c3@127.0.0.1:27017/',
    db_name: 'co_webyi',
    logs: {
      appenders: [
        {
          type: "console"
        }
      ],
      level: 'all'
    },
    app_base_code: __dirname + '/../app_base_code/',
    app_tpls: __dirname + '/../app_tpls/'
  };
})();
