# 生成配置文件
module.exports = (doc, stdout)->
	config = require '../config'
	Q = require 'q'
	# deferred = Q.defer()
	# deferred.reject err
	# deferred.resolve rows
	# deferred.promise
	log4js = require 'log4js'
	Error = require '../utils/Error'
	swig = require('./SwigSetFilter')()
	GenerateCodeFile = require './GenerateCodeFile'
	AppItem = require '../models/AppItem'

	base_code_dir = config.app_base_code
	tpls_dir = config.app_tpls
	generate_to_dir = ''
	file_path = ''

	Q.fcall ->
		return true unless doc || doc.server_port
		AppItem.findByIdQ doc._id
	.then (app_item_doc)->
		generate_to_dir = app_item_doc.directory
		code_str = swig.compileFile(tpls_dir+'config.coffee.html')
		code_str = code_str
			doc: doc
		file_path = generate_to_dir+'app/config.coffee'
		GenerateCodeFile file_path, code_str, stdout