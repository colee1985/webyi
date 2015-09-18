var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var wrap = require("gulp-wrap");
var koaService = require('gulp-koa-service');
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
var ngmin = require('gulp-ngmin');
var coffee = require('gulp-coffee');

// 静态文件目录
var wwwroot = './atom-shell/resources/app/static';
// 文件配置
var paths = {
	coffees: ["atom-shell/resources/app/static/scripts/main.coffee", "atom-shell/resources/app/static/scripts/**/*.coffee"],
	// scripts   : ["trunk2/static/scripts/modules/**/*.js", "trunk2/static/scripts/main.js", "trunk2/static/scripts/**/*.js"],
	styles   : ['atom-shell/resources/app/static/styles/main.css', 'atom-shell/resources/app/static/styles/**/*.css'],
	templates: ['atom-shell/resources/app/static/templates/**/*.html'],
	// services: ["trunk2/**/*.js", "trunk2/index.js", "!trunk2/static/**/*.js", "!trunk2/node_modules/**/*.*"],
	// test: ["trunk2/test/**/*.test.js"],
	// tool: ["**/*.js", "!app/**", "!node_modules/**", "!static/**"]
};

// web service 启动
gulp.task('run_service', function() {
	// return gulp.src(['./trunk2/index.js'])
	// // .pipe(uglify())
	// .pipe(koaService({
	// 	file: './trunk2/index.js'
	// })).on('error', function(e){
	// 	console.log(e);
	// });
});

gulp.task("scripts", function() {
	gulp.src(paths.coffees)
	.pipe(sourcemaps.init())
	.pipe(coffee({bare: true}).on('error', console.log))
	.pipe(concat('app.min.js'))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(wwwroot))
	.pipe(wrap('(function(window){\n"use strict"\n<%= contents %>\n})(window);'))
	.pipe(ngmin({dynamic: false}))
	.pipe(uglify({outSourceMap: true}))
	.pipe(concat('app.min.js'))
	.pipe(gulp.dest(wwwroot));
});

gulp.task('templates', function () {
	
});

gulp.task('styles', function () {
	return gulp.src(paths.styles)
	.pipe(concat('app.css'))
	.pipe(gulp.dest(wwwroot))
	.pipe(cssmin())
	.pipe(concat('app.min.css'))
	.pipe(gulp.dest(wwwroot));
});





// 工具 web操作服务
// gulp.task('tool_service', function() {
// 	return gulp.src(['./server.js'])
// 	// .pipe(uglify())
// 	.pipe(koaService({
// 		file: './server.js'
// 	})).on('error', function(e){console.log(e);});
// });
// gulp.task('watch_tool', ['tool_service'],function() {
// 	gulp.watch(paths.tool, ['tool_service']);
// });

// gulp.task('run_test', function(){
// 	var parame = process.argv[3] || '';
// 	var grep = parame.substr(2);
// 	var file_path = 'trunk2/test/'+grep;
// 	console.log(',,,,,,,',grep,parame,',,,,,,,');
// 	return gulp.src(paths.test)
// 	.pipe(mocha({
// 		reporter: 'spec',
// 		grep: new RegExp('.*'+grep+'.*',"i")
// 	}));
// });
// 使用方式
// eg: gulp test --找回密码
// gulp.task("test", function(){
// 	gulp.run('run_test');
// 	gulp.watch(paths.services, ['run_test']);
// 	gulp.watch(paths.test, ["run_test"]);
// });

gulp.task("watch", function() {
	gulp.watch(paths.coffees, ["scripts"] );
	gulp.watch(paths.templates, ["templates"] );
	gulp.watch(paths.styles, ['styles']);
	// gulp.watch(paths.services, ['run_service']);
});

gulp.task("build", ["scripts", "styles", "templates"]);
gulp.task("default", ["build", "run_service", "watch"]);
