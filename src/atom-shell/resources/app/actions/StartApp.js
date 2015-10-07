// 启动或重启应用
var _ = require('underscore');
var spawn = require('../lib/ChildProcessManage');
var services = {};//当前启动的服务列表

exports.services = services;
exports.run = function (path, progressCallback) {
	progressCallback('正在启动应用……');
	var service = services[path];
	if(service && service.kill){
		service.kill('SIGTERM');
	}
	// 指令名称
	// var command = 'gulp';
	// if(process.platform=='win32'){
	// 	command += '.cmd';
	// }
	var command = __dirname+'/../node_modules/gulp/bin/gulp.js';
	// 运行参数

	var run_params = [command, '--color'];
	service  = spawn('node', run_params, {
		cwd: path+'./../'
	});
	progressCallback(run_params);
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
		progressCallback(err.stack);
		// progressCallback(err);
	});
	// 注册子进程关闭事件
	service.on('exit', function (code, signal) {
		progressCallback('子进程已退出，代码：'+code);
	});
	services[path] = service;

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
