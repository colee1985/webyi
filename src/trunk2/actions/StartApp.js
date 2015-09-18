// 启动或重启应用
var _ = require('underscore');
var spawn = require('child_process').spawn;
var services = {};//当前启动的服务列表

exports.services = services;
exports.run = function (io, path) {
	var socket = function () {
		return io.sockets.in(path);
	};
	socket().emit('console', {'进入项目': path});

	var service = services[path];
	if(service && service.kill){
		service.kill('SIGTERM');
	}
	// 指令名称
	var command = 'gulp';
	if(process.platform=='win32'){
		command += '.cmd';
	}
	// 运行参数
	var run_params = ['--color'];
	// service  = spawn('node', ['--harmony', 'index.js', '--color'], {cwd: path});
	service  = spawn(command, run_params, {cwd: path+'../'});
	service.stdout.setEncoding('utf8');
	// 捕获标准输出并将其打印到控制台
	service.stdout.on('data', function (data) {
		console.log(data);
		socket().emit('console', data.toString());
	});
	// 捕获标准错误输出并将其打印到控制台
	service.stderr.on('data', function (data) {
		console.log('错误输出:', data.toString());
		socket().emit('console', data.toString());
	});
	service.on('error', function(err){
		console.log('子进程出错:',err);
		socket().emit('console', err);
	});
	// 注册子进程关闭事件
	service.on('exit', function (code, signal) {
		console.log('子进程已退出，代码：%s',code);
		socket().emit('console', code);
	});
	socket().emit('console', service.pid);
	services[path] = service;
	io.sockets.emit('runingAppList', _.keys(services));

	// var gulp = require("gulp");
	// // web service 启动
	// gulp.task('run_service', function() {
	// 	startApp();
	// });
	// gulp.task('watch', function(){
	// 	gulp.watch([path+"./**/*.js", path+'./*.js'], ['run_service']);
	// });
	// gulp.run('watch');
};
