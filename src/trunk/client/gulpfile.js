var gulp = require("gulp");
var concat = require("gulp-concat");
var coffee = require("gulp-coffee");
var uglify = require('gulp-uglify');
var stylus = require("gulp-stylus");
var cssmin = require('gulp-cssmin');
var wrap = require("gulp-wrap");
var additem = require("gulp-additem");
var templateCache = require('gulp-angular-templatecache');
var clean = require("gulp-clean");
var karma = require('gulp-karma');

var build_dir = './../wwwroot/';
var app_name = 'CoWebYi';
var paths = {
	app_coffee   : ["app/scripts/main.coffee", "app/scripts/**/*.coffee"],
	images   : ['app/images/**/*'],
	vender   : ['app/vender/**/*'],
	stylus   : ['app/styles/app.styl', 'app/styles/**/*.styl'],
	templates: ['app/templates/**/*.html'],
	manifest : ['app/manifest.json', 'app/index.html'],
	testFiles: ['app/test/**/*']
};

gulp.task("app_main", function() {
	var cs = gulp.src(paths.app_coffee).pipe(coffee({bare: true})).pipe(concat('m.js'));
	var tpls = gulp.src(paths.templates)
	.pipe(templateCache({
		module: app_name+'Templates',
		standalone: true,
		root: 'templates/',
		filename: "templates.js"
	}));
	cs.pipe(additem( tpls ))
	.pipe(concat('m.js'))
	.pipe(wrap('(function(window){\n"use strict"\n<%= contents %>\n})(window);'))
	.pipe(concat('app.js'))
	.pipe(gulp.dest(build_dir))
	.pipe(uglify())
	.pipe(concat('app.min.js'))
	.pipe(gulp.dest(build_dir));
});

gulp.task('stylus', function () {
	return gulp.src(paths.stylus)
	.pipe(stylus())
	.pipe(concat('app.css'))
	.pipe(gulp.dest(build_dir))
	.pipe(cssmin())
	.pipe(concat('app.min.css'))
	.pipe(gulp.dest(build_dir));
});

gulp.task('images', function () {
	return gulp.src(paths.images)
	.pipe(gulp.dest(build_dir+'images'));
});

gulp.task('vender', function () {
	return gulp.src(paths.vender)
	.pipe(gulp.dest(build_dir+'vender'));
});
// chrome 清单文件
gulp.task('manifest', function () {
	gulp.src(paths.manifest)
	.pipe(gulp.dest(build_dir));
});

gulp.task('clean', function(){
	return gulp.src(build_dir, {read: false})
	.pipe(clean());
});

gulp.task('test_complie', function() {
	return gulp.src(paths.testFiles)
	.pipe(coffee())
	.pipe(gulp.dest(build_dir+'test'));
});
gulp.task('test_watch', function() {
	return gulp.src([
		'../wwwroot/vender/q.js',
		'../wwwroot/vender/jQuery/jquery.min.js',
		'../wwwroot/vender/angular/angular.js',
		'../wwwroot/vender/angular/angular-mocks.js',
		'../wwwroot/vender/angular/angular-ui-router.js',
		'../wwwroot/vender/angular/angular-translate.js',
		'../wwwroot/vender/angular/angular-mobile.js',
		'../wwwroot/vender/angular/angular-carousel.js',
		'../wwwroot/vender/angular/angular-md5.js',
		'../wwwroot/vender/angular/angular-animate-1.2.5.js',
		'../wwwroot/vender/angular/angular-cookies.min.js',
		'../wwwroot/vender/underscore/underscore-1.5.2.js',
		'../wwwroot/vender/bootstrap/v2.3.2/js/bootstrap.min.js',
		'../wwwroot/app.js',
		'../wwwroot/vender/should/should.min.js',
		'../wwwroot/test/**/*.js'
	])
	.pipe(karma({
		// configFile: 'karma.conf.js',
		action: 'run',
		browserDisconnectTimeout: 10000,
		browserNoActivityTimeout: 10000,
		frameworks: ['mocha'],
		reporters: ['spec'],
		port: 9876,
		proxies: {
			'/':'http://127.0.0.1:1080/'
		},
		urlRoot: "/__karma/",
		singleRun: true,
		browsers: ['PhantomJS'] //Chrome | PhantomJS

	}));
});


gulp.task("watch", function() {
	gulp.watch(paths.app_coffee, ["app_main"] );
	gulp.watch(paths.templates, ["app_main"] );
	gulp.watch(paths.stylus, ['stylus']);
	// gulp.watch(paths.images, ['images']);
	// gulp.watch(paths.vender, ['vender']);
	// gulp.watch(paths.manifest, ['manifest']);
	// gulp.watch(paths.testFiles, ['test_complie', 'test_watch']);
});

gulp.task("build", ["app_main", "stylus", "images", "vender", "manifest", 'test_complie', 'test_watch']);
gulp.task("default", ["build" ,"watch"]);