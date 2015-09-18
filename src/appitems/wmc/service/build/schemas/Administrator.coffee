Q = require 'q'
mongoose = require "../utils/mongoose"
            
module.exports = new mongoose.Schema

	email: 
		type: String     
		default: null 
		intro: '邮箱'

	mobile: 
		type: String     
		default: null 
		intro: '手机号'

	password: 
		type: String     
		default: null 
		intro: '密码'

	token: 
		type: String     
		default: null 
		intro: 'TOKEN'

	token_expires_time: 
		type: String     
		default: null 
		intro: 'TOKEN有效时长'

	: 
		type: String     
		default: null 
		intro: ''
