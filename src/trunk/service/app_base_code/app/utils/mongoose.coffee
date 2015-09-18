# test
# Schema = mongoose.Schema
# blogSchema = new Schema
# 	title:  String
# 	author: String
# 	body:   String
# =============== End ========================




settings = require '../config'
# ============= 连接mongodb ==================
mongoose = require 'mongoose'
# mongoose.set('debug', true)
do connect = ->
	mongoose.connect settings.monogo+settings.db_name,
		# db:
		# 	native_parser: true
		server:
			poolSize: 5 #连接池内连接个数
		# replset:
		# 	rs_name: 'myReplicaSetName'
		# user: 'myUserName'
		# pass: 'myPassword'
 # Error handler
	mongoose.connection.on 'error', (err)->
		console.log(err)
 # Reconnect when closed
mongoose.connection.on 'disconnected',  ()->
	connect()

# =============== End ========================
mongooseQ = require('mongoose-q')(mongoose)
module.exports = mongoose