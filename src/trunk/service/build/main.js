var MongoStore, app, express, init_mongoose, io, routes, server, settings, swig;

settings = require('./config');

init_mongoose = require('./utils/mongoose');

express = require('express');

swig = require('swig');

app = express();

app.use(express.favicon());

app.use(express.logger("dev"));

app.use(express.urlencoded());

app.use(express.json());

app.use(express.methodOverride());

app.use(require('connect-multiparty')());

MongoStore = require('connect-mongo')(express);

app.use(express.cookieParser(settings.db_name));

app.use(express.session({
  secret: settings.db_name,
  cookie: {
    maxAge: 3600 * 24 * 7
  },
  store: new MongoStore({
    url: settings.monogo,
    db: settings.db_name
  })
}));

app.engine("html", swig.renderFile);

app.set("view engine", "html");

app.set("views", __dirname + "/views");

app.set("view cache", false);

swig.setDefaults({
  cache: false
});

app.use(app.router);

if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

routes = require('./routes');

app.use(routes(app));

app.use(express["static"](__dirname + '/../../wwwroot'));

app.enable('trust proxy');

server = require('http').Server(app);

server.listen(settings.server_port, function() {
  return console.log("Express server listening on port %s in %s mode", settings.server_port, app.get('env'));
});

io = require('socket.io')(server);

io.on("connection", require('./events'));

io.on('uncaughtException', function(err) {
  return console.log(err, '-------- io err');
});

io.on('error', function(err) {
  return console.log(err, '-------- io err');
});
