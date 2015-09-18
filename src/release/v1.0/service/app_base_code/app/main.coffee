# 载入配置文件
settings = require './config'
# 初始化数据库连接
init_mongoose = require './utils/mongoose'
express = require 'express'
swig = require 'swig'

app = express()
app.use express.favicon()
app.use express.logger("dev")
app.use express.urlencoded()
app.use express.json()
app.use express.methodOverride()
app.use require('connect-multiparty')()

# ================ 设置session =======================
MongoStore = require('connect-mongo')(express)
app.use express.cookieParser(settings.db_name)
# 如果使用cookieSession，则后面的session将无效
# app.use express.cookieSession({secret : 'co-task'})
app.use express.session
	secret: settings.db_name
	cookie:
		maxAge: 3600*24*7
	store: new MongoStore
		url: settings.monogo
		db: settings.db_name
# ================= End session =========================

# ================= 设置模板 ====================
app.engine "html", swig.renderFile
app.set "view engine", "html"
app.set "views", __dirname + "/views"

# Swig will cache templates for you, but you can disable
# that and use Express's caching instead, if you like:
app.set "view cache", false

# To disable Swig's cache, do the following:
swig.setDefaults cache: false
# ================ End 模板 ========================

# 注意这个放置的顺序很重要，不要放在session之前，要放在session之后，否则会提示cannot set property 'name' of undefined 
app.use app.router
if ('development' == app.get('env'))
	app.use(express.errorHandler())

# ================================================= API ==================================
routes = require './routes'
app.use routes(app)
# ================================================= End API ==================================
# 设置静态发布目录
app.use(express.static(__dirname+'/../../wwwroot'))

# 设置为反向代理访问模式，即在nginx后面
app.enable('trust proxy')
# app.listen(settings.server_port)
# console.log("Express server listening on port %s in %s mode", settings.server_port, app.get('env'))

server = require('http').Server(app)
server.listen settings.server_port, ->
	console.log("Express server listening on port %s in %s mode", settings.server_port, app.get('env'))
io = require('socket.io')(server)
io.on "connection", require './events'
# io.set "authorization", (handshakeData, callback) ->
# 	console.log handshakeData, handshakeData.headers.cookie
# 	callback null, true # error first callback style