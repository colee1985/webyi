# 运行请求测试
module.exports = (doc, stdout)->
	config = require '../config'
	Q = require 'q'
	log4js = require 'log4js'
	Mocha = require 'mocha'
	child_process = require 'child_process'
	AppItem = require '../models/AppItem'

	base_code_dir = config.base_code_dir
	tpls_dir = config.tpls_dir
	generate_to_dir = ''

	file_path = ''
	
	run = null
	Q.fcall ->
		AppItem.findByIdQ doc.app_item_id
	.then (app_item_doc)->
		throw 'app_item_doc 不能为空' unless app_item_doc
		generate_to_dir = app_item_doc.directory
		dest_file_path = generate_to_dir+'build/tests/routes/'+doc.title+'.test.js'
		deferred = Q.defer()
		command = if process.platform=='win32' then 'mocha.cmd' else 'mocha'
		run = child_process.spawn command,['-R', 'dot', '-C', dest_file_path]
		run.stdout.setEncoding('utf8')
		run.stdout.pipe process.stdout
		run.stderr.pipe process.stderr
		if stdout
			run.stdout.on 'data', stdout
			run.stderr.on 'data', stdout
		run.on 'uncaughtException', (err)->
			stdout err if stdout
		run.on 'error', (err)->
			stdout err if stdout
			console.log err
		run.on 'exit', (code, signal)->
			deferred.resolve code
		deferred.promise