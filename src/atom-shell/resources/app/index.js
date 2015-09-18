var app = require('app');
var Menu = require('menu');
var MenuItem = require('menu-item');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var spawn = require('child_process').spawn;
var _ = require('underscore');

var mainWindow = null;
var menu = null;

// 子进程池
var child_process_pool = [];
ipc.on('add_child_process', function(e, child_process){
	child_process_pool.push(child_process);
	console.log(child_process.pid);
});
// Quit when all windows are closed.
app.on('window-all-closed', function() {
	// console.log(mainWindow, mainWindow.webContents);
	// 结束所有子进程
	_.each(child_process_pool, function(service, key){
		// service.kill('SIGTERM');
		console.log(process.platform, service.pid)
		if(process.platform=='win32'){
			spawn('TASKKILL', ['/F', '/T', '/PID', service.pid],{
				detached: true,
				stdin: ['ignore']
			});
		}else{
			spawn('kill', ['-9', service.pid]);
		}
		delete child_process_pool[key];
	});
	app.quit();
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 700,
		resizable: true,
		'auto-hide-menu-bar': true,
		'use-content-size': true,
	});
	mainWindow.loadUrl('file://' + __dirname + '/static/index.html');
	mainWindow.openDevTools({detach: false});
	/*mainWindow.on('close', function(){
		
	});*/
	mainWindow.focus();
	// mainWindow.webContents.on('did-finish-load', function() {
	// 	mainWindow.webContents.send('ping', {h:'whoooooooh!'});
	// });
	// mainWindow.webContents.on('destroyed', function(data){
	// 	console.log('destroyed:',data);
	// });
	
	var gulp = require('gulp');
	gulp.watch([
		__dirname + '/static/app.min.js'
		,__dirname + '/static/index.html'
		,__dirname + '/static/app.min.css'
		,__dirname + '/actions/**/*.js'
	], function(){
		console.log('reload');
		mainWindow.reload();
	});
});