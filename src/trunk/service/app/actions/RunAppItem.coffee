# 运行APP Item
module.exports = (app_item_id, stdout)->
	config = require '../config'
	Q = require 'q'
	# deferred = Q.defer()
	# deferred.reject err
	# deferred.resolve rows
	# deferred.promise
	crypto = require 'crypto'
	log4js = require 'log4js'
	Error = require '../utils/Error'
	child_process = require 'child_process'
	AppItem = require '../models/AppItem'

	base_code_dir = config.base_code_dir
	tpls_dir = config.tpls_dir
	generate_to_dir = ''

	Q.fcall ->
		AppItem.findByIdQ app_item_id
	.then (app_item_doc)->
		generate_to_dir = app_item_doc.directory
		run_process = process.run_apps[app_item_id]
		process.kill run_process.pid, 'SIGTERM'
	.then (msg)->
		return msg
	.fail (err)->
		return err
	.then (msg)->
		run_process = child_process.spawn 'node',[generate_to_dir+'build/main.js']
		run_process.stdout.setEncoding('utf8')
		run_process.stdout.on 'data', (data)->
			stdout data if stdout

		run_process.stderr.on 'data', (data)->
			stdout data if stdout

		run_process.on 'exit', (code, signal)->
			msg = run_process.pid+'子进程已退出，代码：' + code
			stdout msg if stdout
		run_process.on 'uncaughtException', (err)->
			stdout err.toString() if stdout
		run_process.on 'error', (err)->
			stdout err.toString() if stdout

		process.run_apps = {} unless process.run_apps
		process.run_apps[app_item_id] = run_process