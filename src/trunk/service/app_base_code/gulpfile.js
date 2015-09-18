var gulp = require("gulp");
var coffee = require("gulp-coffee");
var clean = require("gulp-clean");
var expressService = require('gulp-express-service');
var mocha = require('gulp-mocha');

var build_dir = './build/';

var paths = {
	coffee: ['app/main.coffee', 'app/**/*.coffee' ,'!app/test/**/*.coffee'],
	templates: ['app/**/*.html'],
	test: ['app/test*/**/*.coffee']
};

gulp.task('clean', function(){
	return gulp.src(build_dir, {read: false})
	.pipe(clean());
});

gulp.task('main', function() {
	return gulp.src(paths.coffee)
	.pipe(coffee({
		'bare': true
	}))
	.pipe(gulp.dest(build_dir))
	.pipe(expressService({
		file: build_dir+'main.js'
		// ,NODE_ENV: 'DEV'
	}));
});
gulp.task('templates', function() {
	return gulp.src(paths.templates)
	.pipe(gulp.dest(build_dir));
});
gulp.task('run_test', function(){
	var parame = process.argv[3] || '';
	var grep = parame.substr(2);
	console.log(grep);
	return gulp.src(paths.test)
	.pipe(coffee())
	.pipe(gulp.dest(build_dir))
	.pipe(mocha({
		reporter: 'spec',
		grep: new RegExp(grep,"gi")
	}));
});

gulp.task("watch", function() {
	gulp.watch(paths.coffee, ['main']);
	gulp.watch(paths.templates, ['templates']);
});

gulp.task("build", ["main", 'templates']);
gulp.task("default", ["build", "watch"]);

// 使用方式
// eg: gulp test --找回密码
gulp.task("test", function(){
	gulp.run('run_test');
	gulp.watch(paths.coffee, ['run_test']);
	gulp.watch(paths.test, ["run_test"]);
	gulp.watch(paths.templates, ['run_test']);
});