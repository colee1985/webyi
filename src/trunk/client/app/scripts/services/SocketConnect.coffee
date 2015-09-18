# socket connect 连接服务
ag.factory 'SocketConnect', ['AppConfig', 'toast', 'GlobalLoading', '$rootScope', 'Logger',
(app, toast, GlobalLoading, $scope, Logger)->
	socket = io.connect "/"
	socket.on 'message', (data)->
		Logger.info data
		GlobalLoading.hide()
	# socket.emit 'RunAppItem', '53b535bd91cb91283ced78f5'
	
	emit: (event_name, data)->
		GlobalLoading.show('运行测试……')
		socket.emit event_name, data
]

# socket.on "news", (data) ->
# 	console.log data
# 	socket.emit "my other event",
# 		my: "data" 