module.exports = (socket)->
	socket.emit "message",
		content: '连接成功'
		time: new Date()

	# 清除项目目录
	socket.on 'CleanAppItemDir', (app_item_id)->
		CleanAppItemDir = require './actions/CleanAppItemDir'
		CleanAppItemDir app_item_id, (data)->
			socket.emit 'message',
				content: data.toString()
				time: new Date()
		.done()
	# 生成项目
	socket.on 'GenerateAppItem', (app_item_id)->
		GenerateBaseAppItem = require './actions/GenerateBaseAppItem'
		GenerateConfig = require './actions/GenerateConfig'
		model = require './models/AppItem'

		socket.emit 'message',
			content: '开始GenerateAppItem'
			time: new Date()
		model.findByIdQ app_item_id
		.then (doc)->
			GenerateBaseAppItem doc.directory, (data)->
				socket.emit 'message',
					content: data.toString()
					time: new Date()
			.then ->
				return doc
		.then (doc)->
			GenerateConfig doc, (data)->
				socket.emit 'message',
					content: data.toString()
					time: new Date()
		.done()
	# 生成项目配置文件
	socket.on 'GenerateConfig', (app_item_doc)->
		Q = require 'q'
		GenerateConfig = require './actions/GenerateConfig'
		Q.fcall ->
			GenerateConfig app_item_doc, (data)->
				socket.emit 'message',
					content: data.toString()
					time: new Date()
		.done()
	

	# 查看正在运行的APP的进程
	socket.on "RunAppItem", (app_item_id) ->
		unless app_item_id
			return socket.emit 'message',
				content: 'app_item_id 不能为空'
				time: new Date()
		RunAppItem = require './actions/RunAppItem'
		RunAppItem app_item_id, (data)->
			socket.emit 'message', 
				content: data.toString()
				time: new Date()

	# 生成代码文件
	socket.on 'GenerateCodeFile', (doc)->
		config = require './config'
		AppItem = require './models/AppItem'
		GenerateCodeFile = require './actions/GenerateCodeFile'

		AppItem.findByIdQ doc.app_item_id
		.then (app_item_doc)->
			file_path = app_item_doc.directory+doc.name
			GenerateCodeFile file_path, doc.code, (data)->
				socket.emit 'message',
					content: data.toString()
					time: new Date()
		.done()

	# 数据模式测试
	socket.on 'RunSchameTest', (doc)->
		Q = require 'q'
		GenerateSchema = require './actions/GenerateSchema'
		GenerateModel = require './actions/GenerateModel'
		Q.fcall ->
			GenerateSchema doc, (data)->
				socket.emit 'message', 
					content: data.toString()
					time: new Date()
		.then ->
			GenerateModel doc, (data)->
				socket.emit 'message', 
					content: data.toString()
					time: new Date()
		.fail (err)->
			console.log err
			socket.emit 'message',
				content: err.toString()
				time: new Date()
		.done()

	# 功能代码测试
	socket.on 'RunActionTest', (doc)->
		Q = require 'q'
		GenerateAction = require './actions/GenerateAction'
		GenerateActionTest = require './actions/GenerateActionTest'
		RunActionTest = require './actions/RunActionTest'
		Q.fcall ->
			GenerateAction doc, (data)->
				socket.emit 'message', 
					content: data.toString()
					time: new Date()
		.then ->
			GenerateActionTest doc, (data)->
				socket.emit 'message', 
					content: data.toString()
					time: new Date()
		.then ->
			RunActionTest doc, (data)->
				socket.emit 'message', 
					content: data.toString()
					time: new Date()
		.fail (err)->
			console.log err
			socket.emit 'message', 
				content: err.toString()
				time: new Date()
		.done()
	# URL请求代码测试
	socket.on 'RunRequrlTest', (doc)->
		Q = require 'q'
		RunRequrlTest = require './actions/RunRequrlTest'
		Q.fcall ->
			RunRequrlTest doc, (data)->
				socket.emit 'message',
					content: data.toString()
					time: new Date()
		.done()