Q = require 'q'
_  = require 'underscore'
_.str = require 'underscore.string'
log4js = require 'log4js'
Error = require './utils/Error'
validator = require 'validator'
AppItem = require './actions/AppItem'
Schema = require './actions/Schema'
Requrl = require './actions/Requrl'
Action = require './actions/Action'
CodeFile = require './actions/CodeFile'

module.exports = (app)->

	app.get '/test', (req, res)->
		Q.fcall ->
			GenerateFile.clean()
		.then ()->
			GenerateFile.copeBase()
		.then ()->
			GenerateFile.routes()
			GenerateFile.schemas()
			GenerateFile.models()
			GenerateFile.actions()
		.then (str)->
			res.send str
		.fail (err)->
			log4js.getLogger('err').error err
			res.send err
		.done()
		# res.render '../views/test.html'
	# ======================================================================
	# ---------------------- 文件及目录获取 -------------------------------
	# ======================================================================
	app.get '/api/file/findByDir', (req, res)->
		GetFilesByDir = require './actions/GetFilesByDir'
		Q.fcall ->
			dir = req.query.dir
			GetFilesByDir dir
		# GetTreeByDir = require './actions/GetTreeByDir'
		# Q.fcall ->
		# 	GetTreeByDir req.query.dir
		.then (data)->
			console.log data, typeof(data)
			res.send data
		.fail (err)->
			res.send err
		.done()
	app.get '/api/file/findContentByPath', (req, res)->
		GetFileContentByPath = require './actions/GetFileContentByPath'
		Q.fcall ->
			path = req.query.path
			GetFileContentByPath path
		.then (data)->
			res.send 
				content: data
		.fail (err)->
			res.send err
		.done()
	app.post '/api/file/save', (req, res)->
		SaveFile2Path = require './actions/SaveFile2Path'
		Q.fcall ->
			path = req.body.path
			content = req.body.content
			SaveFile2Path path, content
		.then (data)->
			res.send 
				content: data
		.fail (err)->
			res.send err
		.done()
	# ======================================================================
	# ---------------------- 项目管理处理 -------------------------------
	# ======================================================================
	app.post '/api/appitem/save', (req, res)->
		Q.fcall ->
			model = req.body.model
			console.log model,'doc'
			throw new Error 100010, 'model 不能为空' unless model
			AppItem.save req.body.model
		.then (doc)->
			res.send doc
		.fail (err)->
			log4js.getLogger('appitem/save err').info err
			res.send err
		.done()

	app.get '/api/appitem/findById', (req, res)->
		Q.fcall ->
			id = req.query._id
			throw new Error 100010, '_id 不能为空' unless id
			AppItem.findById req.query._id
		.then (doc)->
			res.send doc
		.fail (err)->
			res.send err
		.done()

	app.post '/api/appitem/del', (req, res)->
		Q.fcall ->
			id = req.body._id
			throw new Error 100010, '_id 不能为空' unless id
			AppItem.del id
		.then (doc)->
			res.send doc
		.fail (err)->
			res.send err
		.done()

	app.get '/api/appitem/list', (req, res)->
		Q.fcall ->
			AppItem.getList req.query.creater_id
		.then (docs)->
			res.send docs
		.fail (err)->
			res.send err
		.done()
	# ======================================================================
	# ---------------------- 数据模型功能处理 -------------------------------
	# ======================================================================
	app.post '/api/schema/save', (req, res)->
		Q.fcall ->
			model = req.body.model
			throw new Error 100010, 'model 不能为空' unless model
			Schema.save model
		.then (doc)->
			res.send doc
		.fail (err)->
			res.send err
		.done()

	app.get '/api/schema/findById', (req, res)->
		Q.fcall ->
			id = req.query._id
			throw new Error 100010, '_id 不能为空' unless id
			Schema.findById id
		.then (doc)->
			res.send doc
		.fail (err)->
			res.send err
		.done()

	app.post '/api/schema/del', (req, res)->
		Q.fcall ->
			id = req.body._id
			throw new Error 100010, '_id 不能为空' unless id
			Schema.del id
		.then (doc)->
			res.send doc
		.fail (err)->
			res.send err
		.done()

	app.get '/api/schema/list', (req, res)->
		Q.fcall ->
			Schema.getList req.query.app_item_id, req.query.creater_id
		.then (docs)->
			res.send docs
		.fail (err)->
			res.send err
		.done()

	# ======================================================================
	# ---------------------- URL请求功能处理 -------------------------------
	# ======================================================================
	app.post '/api/requrl/save', (req, res)->
		Q.fcall ->
			model = req.body.model
			throw new Error 100010, 'model 不能为空' unless model
			Requrl.save req.body.model
		.then (doc)->
			res.send doc
		.fail (err)->
			log4js.getLogger('requrl/save err').info err
			res.send err
		.done()

	app.get '/api/requrl/findById', (req, res)->
		Q.fcall ->
			id = req.query._id
			throw new Error 100010, '_id 不能为空' unless id
			Requrl.findById req.query._id
		.then (doc)->
			res.send doc
		.fail (err)->
			res.send err
		.done()

	app.post '/api/requrl/del', (req, res)->
		Q.fcall ->
			id = req.body._id
			throw new Error 100010, '_id 不能为空' unless id
			Requrl.del id
		.then (doc)->
			res.send doc
		.fail (err)->
			res.send err
		.done()

	app.get '/api/requrl/list', (req, res)->
		Q.fcall ->
			Requrl.getList req.query.app_item_id, req.query.creater_id
		.then (docs)->
			res.send docs
		.fail (err)->
			res.send err
		.done()

	# ======================================================================
	# ---------------------- 功能数据处理 -------------------------------
	# ======================================================================
	app.post '/api/action/save', (req, res)->
		Q.fcall ->
			model = req.body.model
			throw new Error 100010, 'model 不能为空' unless model
			Action.save req.body.model
		.then (doc)->
			res.send doc
		.fail (err)->
			log4js.getLogger('action/save err').info err
			res.send err
		.done()

	app.get '/api/action/findById', (req, res)->
		Q.fcall ->
			id = req.query._id
			throw new Error 100010, '_id 不能为空' unless id
			Action.findById req.query._id
		.then (doc)->
			res.send doc
		.fail (err)->
			res.send err
		.done()

	app.post '/api/action/del', (req, res)->
		Q.fcall ->
			id = req.body._id
			throw new Error 100010, '_id 不能为空' unless id
			Action.del id
		.then (doc)->
			res.send doc
		.fail (err)->
			res.send err
		.done()

	app.get '/api/action/list', (req, res)->
		Q.fcall ->
			Action.getList req.query.app_item_id, req.query.creater_id
		.then (docs)->
			res.send docs
		.fail (err)->
			res.send err
		.done()

	# ======================================================================
	# ---------------------- 代码文件数据处理 -------------------------------
	# ======================================================================
	app.post '/api/codefile/save', (req, res)->
		Q.fcall ->
			model = req.body.model
			throw new Error 100010, 'model 不能为空' unless model
			CodeFile.save req.body.model
		.then (doc)->
			res.send doc
		.fail (err)->
			res.send err
		.done()

	app.get '/api/codefile/findById', (req, res)->
		Q.fcall ->
			id = req.query._id
			throw new Error 100010, '_id 不能为空' unless id
			CodeFile.findById req.query._id
		.then (doc)->
			res.send doc
		.fail (err)->
			res.send err
		.done()

	app.post '/api/codefile/del', (req, res)->
		Q.fcall ->
			id = req.body._id
			throw new Error 100010, '_id 不能为空' unless id
			CodeFile.del id
		.then (doc)->
			res.send doc
		.fail (err)->
			res.send err
		.done()

	app.get '/api/codefile/list', (req, res)->
		Q.fcall ->
			CodeFile.getList req.query.app_item_id, req.query.creater_id
		.then (docs)->
			res.send docs
		.fail (err)->
			res.send err
		.done()













		
	# app.all '*', (req, res, next)->
	# 	log4js.getLogger('routes all '+req.path).info req.path, req.query
	# 	Q.fcall ->
	# 		paths = req.path.split('/')
	# 		controller_name = paths[1]
	# 		action_name = paths[2]
	# 		if controller_name=='' || !controller_name
	# 			controller_name = 'site'
	# 		if action_name=='' || !action_name
	# 			action_name = 'index'
	# 		controller_name = _.str.capitalize(controller_name.toLowerCase())+'Controller'
	# 		# console.log controller_name+' '+action_name
	# 		controller = require './controllers/'+controller_name
	# 		console.log controller
	# 		(controller[action_name])(req, res)
	# 	.fail (err)->
	# 		log4js.getLogger(controller_name+' '+action_name).info err
	# 		res.render '../views/site/error.html', 
	# 			msg: err.toString()

	return (req, res, next)->
		next()