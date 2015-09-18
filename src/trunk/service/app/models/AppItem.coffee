mongoose = require "../utils/mongoose"
log4js = require 'log4js'
Error = require '../utils/Error'

model = new mongoose.Schema
	name: 
		type: String
		trim: false
		lowercase: false
		required: false
		enum: undefined
		default: ''
		intro: ''

	debug: Boolean
	server_port: Number
	db_host: 
		type: String
		default: '127.0.0.1'
	db_port: 
		type: Number
		default: 27017
	db_name: String
	db_username: String
	db_password: String
	other_conf: String

	create_time: 
		type: Date
		trim: false
		lowercase: false
		required: false
		enum: undefined
		default: ''
		intro: ''

	creater_id: 
		type: mongoose.Schema.Types.ObjectId
		trim: false
		lowercase: false
		required: false
		enum: null
		default: null
		intro: ''
	directory: String

try
	mongoose.model('co_appitem', model)
catch e
	# ...
module.exports = mongoose.model 'co_appitem'