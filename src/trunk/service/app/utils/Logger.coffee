settings = require '../config'
log4js = require 'log4js'
log4js.configure settings.logs

# module.exports = (name)->
# 	logger = log4js.getLogger(name)
# 	logger.setLevel settings.logs.level
# 	return logger
# 	# log4js.connectLogger(log4js.getLogger(name), {level:'all', format:':method :url'})

logger = log4js.getLogger('')
logger.setLevel settings.logs.level
module.exports = logger 