# 将代码生成文件
module.exports = (full_file_path, code_str, stdout)->
	Q = require 'q'
	# deferred = Q.defer()
	# deferred.reject err
	# deferred.resolve rows
	# deferred.promise
	fs = require 'fs'
	path = require 'path'
	through = require 'through'
	gulp = require "gulp"
	coffee = require 'gulp-coffee'
	gutil = require 'gulp-util'

	dir_path = path.dirname(full_file_path)+'/'
	file_name = path.basename full_file_path
	# 后缀
	ext = path.extname file_name
	Q.fcall ->
		deferred = Q.defer()
		fs.exists full_file_path, (is_exists)->
			unless is_exists 
				deferred.resolve true
			else
				fs.unlink full_file_path, (err)->
					if err 
						deferred.reject err
					deferred.resolve true
		deferred.promise
	.then ->
		deferred = Q.defer()
		gulp.src full_file_path
		.pipe through null, (file)->
			joinedFile = new gutil.File
				cwd: dir_path
				base: '/'
				path: '/'+file_name
				contents: new Buffer(code_str)
			@emit('data', joinedFile)
			@emit('end')
		.pipe(gulp.dest(dir_path))
		.on 'error', (err)->
			deferred.reject err
			if stdout
				stdout err.toString() 
		.on 'uncaughtException', (err)->
			deferred.reject err
			if stdout
				stdout err.toString()
		.on 'end', ->
			if stdout
				stdout full_file_path+' 完成'
			deferred.resolve true
		deferred.promise
	.then ()->
		deferred = Q.defer()
		build_dir = dir_path.replace 'service\/app\/', 'service\/build\/'
		build_file_path = build_dir+file_name
		gulpfile = gulp.src full_file_path
		if ext=='.coffee'
			build_file_name = file_name.replace '.coffee', '.js'
			build_file_path = build_dir+build_file_name
			gulpfile.pipe coffee()
			.on 'error', (err)->
				deferred.reject err
				if stdout
					stdout err.toString() 
			.on 'uncaughtException', (err)->
				deferred.reject err
				if stdout
					stdout err.toString() 
		gulpfile.pipe gulp.dest build_dir
		.on 'end', ->
			if stdout
				stdout build_file_path+' build 完成'
			deferred.resolve true
		deferred.promise