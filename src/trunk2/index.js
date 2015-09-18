
/**
 * Module dependencies.
 */
var http = require('http');
var koalogger = require('koa-logger');
var route = require('koa-route');
var serve = require('koa-static');
var parse = require('co-body');
var onerror = require('koa-onerror');
var koa = require('koa');
var log4js = require('log4js');
var logger = log4js.getLogger('message');

var app = module.exports = koa();
app.outputErrors = true;
app.env = 'development';
require('./config');

// middleware
onerror(app);
app.use(koalogger());
app.use(serve(__dirname + '/static'));

app.on('error', function (err, ctx){
	console.error('server error', err.message, err.stack);
	var body = JSON.stringify({
		error_code:500000,
		error_msg: err.message
	});
	ctx.res.writeHead(200, {
		'Content-Type': 'application/vnd.api+json' 
	});
	ctx.res.write(body);
	ctx.res.end();
});

var server = http.createServer(app.callback());
var io = require('socket.io')(server);
var StartApp = require('./actions/StartApp');
var CreateSequelize = require('./actions/CreateSequelize');
var  RunTest = require('./actions/RunTest');
io.on('connection', function(socket){

	socket.emit('console', {
		hello: 'world',
		connect_count:io.sockets.server.eio.clientsCount,
		rooms: socket.rooms
	});

	// 加入并运行项目
	socket.on('joinAppAndStart', function(path){
		socket.join(path);
		StartApp.run(io, path);
	});
	// 生成 schemas
	socket.on('createSchemas', function(path){
		socket.join(path);
		CreateSequelize.createSchemas(io, path);
	});
	// 生成 models
	socket.on('createModels', function(path){
		socket.join(path);
		CreateSequelize.createModels(io, path);
	});
	// 生成 routers
	socket.on('createRouters', function(path){
		socket.join(path);
		CreateSequelize.createRouters(io, path);
	});
	// 生成 models.test
	socket.on('createModelTests', function(path){
		socket.join(path);
		CreateSequelize.createModelTests(io, path);
	});
	// 启动测试
	socket.on('runTest', function(path, params){
		socket.join(path);
		RunTest.run(io, path, params);
	});
	// 发送运行的项目列表
	socket.emit('runingAppList', _.keys(StartApp.services));
	// 发送测试用例列表
	RunTest.getTestTree('D:/coleeFlie/htdocs/Co-sumaitong/src/trunk5/').then(function(res){
		socket.emit('testList', res);
	});
	// 连接中断处理
	socket.on('disconnect',function(){
		console.log('连接中断');
	});
});
// listen
// app.listen(1081);//等价于以下一行
server.listen(SERVER_PORT, function () {
	console.log('listening on port %s',SERVER_PORT);
});