// mocha --harmony -d -w test\models\AliexpressCate.test.js

// 启动或重启应用
var Q = require('q');
var _ = require('underscore');
var log4js = require('log4js');
var FS = require("q-io/fs");
var spawn = require('child_process').spawn;
var services = {};//当前启动的服务列表

exports.services = services;
exports.run = function (io, path, params) {

	var socket = function () {
		return io.sockets.in(path);
	};
	// socket().emit('console', {'进入项目': path});

	var service = services[path];
	if(service && service.pid){
		socket().emit('console', '已存在启动的测试用例'+service.pid);
		// service.kill('SIGTERM');
		if(process.platform=='win32'){
			spawn('TASKKILL', ['/F', '/T', '/PID', service.pid]);
		}else{
			spawn('kill', ['-9', service.pid]);
		}
	}
	// 指令名称
	var command = 'mocha';
	if(process.platform=='win32'){
		command += '.cmd';
	}
	// 运行参数
	var run_params = ['--harmony', '-w'];
	if(params && params.grep){
		run_params.push('-g');
		run_params.push(params.grep);
	}
	run_params.push('test/'+params.file);
	socket().emit('console', '启动测试: '+command+run_params.join(' '));

	// service  = spawn('node', ['--harmony', 'index.js', '--color'], {cwd: path});
	service  = spawn(command, run_params, {cwd: path});
	service.stdout.setEncoding('utf8');
	// 捕获标准输出并将其打印到控制台
	service.stdout.on('data', function (data) {
		// console.log(data);
		socket().emit('console', data.toString());
	});
	// 捕获标准错误输出并将其打印到控制台
	service.stderr.on('data', function (data) {
		// console.log('错误输出:', data.toString());
		socket().emit('console', data.toString());
	});
	service.on('error', function(err){
		// console.log('子进程出错:',err);
		socket().emit('console', err);
	});
	// 注册子进程关闭事件
	service.on('exit', function (code, signal) {
		// console.log('子进程已退出，代码：%s',code);
		socket().emit('console', code);
	});
	socket().emit('console', service.pid);
	services[path] = service;
};
// 从测试目录中解析出所有测试用例
exports.getTestTree = function(path){
	var dir  = path+'/test/';
	return FS.listTree(dir).then(function(res){
		var items=[], promise=Q.fcall(function(){});
		_.each(res, function(item){
			var _path = item.split('\\test\\')[1];
			promise = promise.then(function(){
				return FS.isFile(item).then(function(is_true){
					if(is_true){
						return FS.read(item).then(function(code){
							var pat = /it\(['|"](.+?)['|"],/ig;
							var result, tlist = [];
							while( (result=pat.exec(code))!=null ){
								tlist.push(result[1]);
							}
							items.push({
								name: _path,
								list: tlist
							});
						});
					}
				});
			});
		});
		return promise.then(function(){
			return items;
		});
	});
};