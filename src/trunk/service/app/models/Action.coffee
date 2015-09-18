Q = require 'q'
mongoose = require "../utils/mongoose"
log4js = require 'log4js'
Error = require '../utils/Error'

parame = new mongoose.Schema
	name: String
	value: String
	intro: String

model = new mongoose.Schema
	name: String
	parames: [parame]
	intro: String
	code: String
	test_code: String
	creater_id:
		type: mongoose.Schema.Types.ObjectId
		intro: '创建者ID'
	app_item_id:
		type: mongoose.Schema.Types.ObjectId
		intro: '项目ID'
	plan_status: String

# model.pre "save", (next, done) ->
# 	logger.debug @get("email")
# 	next()

module.exports = mongoose.model 'co_action', model
# module.exports = mongoose.model 'member'