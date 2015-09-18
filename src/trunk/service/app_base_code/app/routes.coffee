Q = require 'q'
_  = require 'underscore'
_.str = require 'underscore.string'
log4js = require 'log4js'
Error = require './utils/Error'
validator = require 'validator'


module.exports = (app)->

	app.get '/test', (req, res)->
		res.render '../views/test.html'

	return (req, res, next)->
		next()