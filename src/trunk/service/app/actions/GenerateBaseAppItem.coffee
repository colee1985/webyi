# 生成基础项目目录与文件
module.exports = (app_item_directory, stdout)->
	config = require '../config'
	Q = require 'q'
	# deferred = Q.defer()
	# deferred.reject err
	# deferred.resolve rows
	# deferred.promise
	log4js = require 'log4js'
	Error = require '../utils/Error'
	swig = require('./SwigSetFilter')()
	gulp = require 'gulp'
	through = require 'through'
	coffee = require "gulp-coffee"
	child_process = require 'child_process'
	
	base_code_dir = config.app_base_code
	tpls_dir = config.app_tpls
	generate_to_dir = app_item_directory

	Q.fcall ->
		deferred = Q.defer()
		gulp.src([base_code_dir+'**/*'])
		.pipe gulp.dest generate_to_dir
		.pipe through null, ->
			deferred.resolve true
		deferred.promise
	.then ->
		deferred = Q.defer()
		gulp.src([generate_to_dir+'app/**/*.coffee'])
		.pipe(coffee({
			'bare': true
		}))
		.on 'error', (err)->
			stdout err.toString() if stdout
		.on 'uncaughtException', (err)->
			stdout err.toString() if stdout
		.pipe(gulp.dest(generate_to_dir+'build/'))
		.pipe through null, ->
			stdout '生成成功'
			deferred.resolve true
		deferred.promise
	.then ->
		deferred = Q.defer()
		if process.platform == "win32"
			npm = 'npm.cmd'
		else
			npm = 'npm'
		run_process = child_process.spawn npm, ['install'],
			cwd: generate_to_dir
		run_process.stdout.setEncoding('utf8')
		run_process.stdout.on 'data', stdout
		run_process.stderr.on 'data', stdout
		run_process.on 'exit', (code, signal)->
			msg = run_process.pid+'子进程已退出，代码：' + code
			stdout msg
			deferred.resolve true
		run_process.on 'error', stdout
		run_process.on 'uncaughtException', stdout
		deferred.promise