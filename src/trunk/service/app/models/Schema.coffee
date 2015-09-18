Q = require 'q'
mongoose = require "../utils/mongoose"
log4js = require 'log4js'
Error = require '../utils/Error'

_enum = new mongoose.Schema
	value: String

field = new mongoose.Schema
	name: String
	type: String
	sub_schema: String
	enums: [_enum]
	default: String
	intro: String
model = new mongoose.Schema
	model_name:
		type: 'String'
		intro: '模型名称'
	table_name:
		type: String
		intro: '表名称'
	table_intro:
		type: String
		intro: '表说明'
	fields:
		type: [field]
		intro: '字段集'
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

module.exports = mongoose.model 'co_schema', model
# module.exports = mongoose.model 'member'