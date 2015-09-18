app.factory 'SocketConnect', ()->
	socket = io.connect("http://127.0.0.1:1000/")
	socket.on "error", (err) ->
		console.log "err", err, err.stack

	socket.on "console", (data) ->
		# console.log data
	return socket