# 控制台消息池
ag.factory 'Logger', [ '$rootScope', ($rootScope)->
	logger = log4javascript.getLogger('test')
	# alert(log4javascript.isEnabled())
	# logger.debug('你好啊，log4jjavascript!')
	# logger.info('你好啊，log4jjavascript!')
	# logger.warn('你好啊，log4jjavascript!')
	# logger.error('你好啊，log4jjavascript!')
	# logger.fatal('你好啊，log4jjavascript!')
	logger.show = ->
		popUpAppender = new log4javascript.PopUpAppender()
		# InPageAppender = new log4javascript.InPageAppender()
		logger.addAppender(popUpAppender)
		logger.warn('开启 log4jjavascript!')
	# logger.hide = ->
	# 	logger.setEnabled(false)
	return logger
]