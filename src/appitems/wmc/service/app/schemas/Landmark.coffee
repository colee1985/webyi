Q = require 'q'
mongoose = require "../utils/mongoose"
      
module.exports = new mongoose.Schema

	name: 
		type: String     
		default: null 
		intro: '地标名'

	city: 
		type: String     
		default: null 
		intro: '城市'

	coord: 
		type: mongoose.Schema.Types.Mixed     
		default: null 
		intro: '坐标对象'
