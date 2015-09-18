module.exports = (socket)->
	socket.emit "news",
		hello: "world"

	socket.on "my other event", (data) ->
		console.log data

	setTimeout ->
		socket.emit "news",
			test:'rerer343434343'
	,3000