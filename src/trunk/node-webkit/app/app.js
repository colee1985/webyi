(function(window){
	"use strict"
	var ag;
	ag = angular.module("CoWebYi", ['ui.router', 'pascalprecht.translate']);

	ag.factory('Logger', ['$rootScope', function($rootScope) {
		var logger = {};
		logger.messages = ['start'];
		logger.add = function(data){
			logger.messages.push(data);
			$rootScope.$apply();
			// $element.scrollTop(99999999);
		}
		return logger;
	}]);

	// var gulp = require("gulp");
	// var app_file = 'D:/coleeFlie/htdocs/Co-waimaice/src/trunk/service/gulpfile.js'
	// gulp.run();

	ag.controller('AppsListCtrl', ['$scope', 'Logger', function($scope, Logger){
		$scope.apps = [{
			name: 'mongodb', 
			commands: [{
				title: 'Start', 
				name: 'mongod.exe', 
				params: ['--dbpath=D:/mongodb/datas', '--auth'], 
				cwd: 'D:/mongodb/bin'
			}]
		}];

		$scope.runCommand = function(app, command){
			var spawn = require('child_process').spawn;
			var run = spawn(command.name, command.params, {
				cwd: command.cwd
			});
			run.stdout.on('data', function (data) { 
				Logger.add(data.toString());
			}); 
			// 捕获标准错误输出并将其打印到控制台 
			run.stderr.on('data', function (data) { 
				Logger.add(data.toString());
			}); 
			// 注册子进程关闭事件 
			run.on('exit', function (code, signal) {
				Logger.add('子进程已退出，代码：' + code); 
			});
			command.run = run;
			Logger.add(run.pid); 
		};
	}]);

	ag.controller('LoggerCtrl', ['$scope', 'Logger', '$timeout', '$element', 
	function($scope, Logger, $timeout, $element){
		$scope.messages = Logger.messages;
		$element.css({
			height:'100%',
			overflow: 'auto',
			// border:'1px solid #000'
		});
		
	}]);
})(window);