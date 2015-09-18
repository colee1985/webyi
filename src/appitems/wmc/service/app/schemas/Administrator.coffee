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
		type: Date     
		default: null 
		intro: 'TOKEN有效时长'

	create_time: 
		type: Date     
		default: Date.now 
		intro: '创建时间'

	last_update_time: 
		type: Date     
		default: Date.now 
		intro: '最后更新时间'
