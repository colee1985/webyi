Q = require 'q'
crypto = require 'crypto'
log4js = require 'log4js'
Error = require '../utils/Error'

model = require '../models/Requrl'
GenerateRoutes = require './GenerateRoutes'
GenerateRequrlTest = require './GenerateRequrlTest'

module.exports = do ->
	# 保存时，如果存在_id则更新，否则为创建
	save: (data)->
		Q.fcall ->
			if data._id
				return model.findByIdAndUpdateQ data._id,
					$set: data
			model.createQ data
		.then (doc)->
			model.findQ
				creater_id: data.creater_id
				app_item_id: doc.app_item_id
			.then (docs)->
				GenerateRoutes docs, doc.app_item_id
				GenerateRequrlTest doc
				return doc

	findById: (_id)->
		model.findByIdQ _id
		.then (doc)->
			throw new Error 300000 unless doc
			return doc

	del: (_id)->
		model.findByIdAndRemoveQ _id

	getList: (app_item_id, creater_id)->
		model.findQ
			creater_id: creater_id
			app_item_id: app_item_id
		.then (docs)->
			return docs