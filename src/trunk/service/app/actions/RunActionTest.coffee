# RunUnitTest 运行单元测试
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
		generate_to_dir = app_item_doc.directory
		dest_file_path = generate_to_dir+'build/tests/actions/'+doc.name+'.test.js'
		stdout doc.name+'开始运行测试'
		deferred = Q.defer()
		command = if process.platform=='win32' then 'node' else 'node'
		run = child_process.spawn command,[dest_file_path]
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
			stdout '进程退出' if stdout
			deferred.resolve code
		deferred.promise
	.timeout