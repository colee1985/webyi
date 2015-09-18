# 生成功能单元
module.exports = (doc, stdout)->
	config = require '../config'
	Q = require 'q'
	# deferred = Q.defer()
	# deferred.reject err
	# deferred.resolve rows
	# deferred.promise
	log4js = require 'log4js'
	swig = require('./SwigSetFilter')()
	GenerateCodeFile = require './GenerateCodeFile'
	AppItem = require '../models/AppItem'

	base_code_dir = config.app_base_code
	tpls_dir = config.app_tpls
	generate_to_dir = ''
	file_path = ''

	Q.fcall ->
		AppItem.findByIdQ doc.app_item_id
	.then (app_item_doc)->
		throw '项目不存在' unless app_item_doc
		throw 'doc.name 不能为空' unless doc.name
		generate_to_dir = app_item_doc.directory
		code_str = swig.compileFile(tpls_dir+'action.coffee.html')
		code_str = code_str
			doc: doc
		file_path = generate_to_dir+'app/actions/'+doc.name+'.coffee'
		
		GenerateCodeFile file_path, code_str, stdout