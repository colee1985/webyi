# 清除生成的项目目录与文件
module.exports = (app_item_directory)->
	config = require '../config'
	Q = require 'q'
	# deferred = Q.defer()
	# deferred.reject err
	# deferred.resolve rows
	# deferred.promise
	log4js = require 'log4js'
	Error = require '../utils/Error'
	gulp = require 'gulp'
	clean = require 'gulp-clean'
	through = require 'through'
	code_tpl = require 'co-service-code-templates'
	
	base_code_dir = code_tpl.app_base_code
	tpls_dir = code_tpl.app_tpls
	generate_to_dir = app_item_directory

	Q.fcall ->
		deferred = Q.defer()
		gulp.src generate_to_dir, 
			read: false
		.pipe clean()

		.pipe through null, ->
			deferred.resolve true
		deferred.promise