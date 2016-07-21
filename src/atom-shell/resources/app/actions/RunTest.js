// mocha --harmony -d -w test\models\AliexpressCate.test.js

// 启动或重启应用
var Q = require('q');
var _ = require('underscore');
var log4js = require('log4js');
var FS = require("q-io/fs");
var spawn = require('../lib/ChildProcessManage');
var services = {};//当前启动的服务列表

exports.services = services;
// 关闭所有测试
function closeAll(progressCallback){
	var progressCallback = progressCallback ? progressCallback : function(){};
	_.each(services, function(service, pid){
		progressCallback('已存在启动的测试用例'+pid);
		// service.kill('SIGTERM');
		if(process.platform=='win32'){
			spawn('TASKKILL', ['/F', '/T', '/PID', pid]);
		}else{
			spawn('kill', ['-9', pid]);
		}
		delete services[pid];
	});
}
exports.closeAll = function(progressCallback){
	closeAll(progressCallback);
};

// 运行一个测试用例
exports.run = function (path, params, progressCallback) {
	closeAll(progressCallback);
	// 指令名称
	// var command = 'mocha';
	// if(process.platform=='win32'){
	// 	command += '.cmd';
	// }
	var command = __dirname+'/../node_modules/mocha/bin/_mocha';
	// 运行参数
	var run_params = ['--harmony', command, '-w', '-c'];
	if(params && params.grep){
		run_params.push('-g');
		run_params.push(params.grep);
	}
	run_params.push('test/'+params.file);
	progressCallback('启动测试: '+command+run_params.join(' '));

	var service  = spawn('node', run_params, {
		cwd: path,
		// detached: true,
		// stdio: ['ipc'],
		// timeout: 2000,
		// maxBuffer: 200*1024,
		killSignal: 'SIGKILL',
		env: {
			"PORT": 9090,
			"NODE_ENV": "dev",//production
			"NODE_OPTIONS": "--debug=47977",
		}
	});
	services[service.pid] = service;
	service.stdout.setEncoding('utf8');
	// 捕获标准输出并将其打印到控制台
	service.stdout.on('data', function (data) {
		progressCallback(data.toString());
	});
	// 捕获标准错误输出并将其打印到控制台
	service.stderr.on('data', function (data) {
		progressCallback(data.toString());
	});
	service.on('error', function(err){
		progressCallback(err);
	});
	// 注册子进程关闭事件
	service.on('exit', function (code, signal) {
		delete services[service.pid];
		progressCallback('子进程已退出，代码：'+code);
	});
};

// 从测试目录中解析出所有测试用例
exports.getTestTree = function(path, progressCallback){
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
