Q = require 'q'
crypto = require 'crypto'
log4js = require 'log4js'
Error = require '../utils/Error'

model = require '../models/Schema'

module.exports = do ->
	# 保存时，如果存在_id则更新，否则为创建
	save: (data)->
		Q.fcall ->
			if data._id
				return model.findByIdAndUpdateQ data._id,
					$set: data
			model.createQ data
		.then (doc)->
			return doc

	findById: (_id)->
		model.findByIdQ _id
		.then (doc)->
			throw new Error 300000 unless doc
			return doc

	del: (_id)->
		model.findByIdAndRemoveQ _id

	# 删除字段，暂时不需要此功能，因为通过修改就可以实现
	# delField: (schema_id, field_id)->
	# 	model.findByIdQ schema_id
	# 	.then (doc)->
	# 		fields = doc.fields.filter (item)->
	# 			log4js.getLogger('models.Schema.delField item').info item
	# 			if item._id.toString()!=field_id.toString()
	# 				return item
	# 		doc.fields = fields
	# 		doc.saveQ()
	getList: (app_item_id, creater_id)->
		model.findQ
			creater_id: creater_id
			app_item_id: app_item_id
		.then (docs)->
			return docs