# URL请求控制器
ag.controller 'RequrlCtrl', ['AppConfig', '$scope', 'Requrl', '$state', '$stateParams', 'SocketConnect',
(app, $scope, Requrl, $state, $stateParams, socket)->
	$scope.app = app
	app.active = 'requrl'
	$scope.requrl = Requrl

	if $state.is 'requrl.create'
		$scope.model = Requrl.create()
	else if $state.is 'requrl.update'
		Requrl.findById $stateParams._id
		.then (data)->
			throw data if data.error_code
			$scope.$apply ->
				$scope.model = data
		.fail (err)->
			$state.go 'requrl.create'
		.done()
	$scope.$on '$stateChangeSuccess', (event, toState, toParams, fromState, fromParams)->
		# console.log toState.name
		$state.reload()
		
	$scope.addParame = (method)->
		$scope.model[method].push new Requrl.getParame()
	$scope.delParame = (method, index)->
		$scope.model[method].splice index,1

	$scope.save = ()->
		Requrl.save $scope.model
		.then (res)->
			$state.go 'requrl.update',
				_id: res._id
			console.log res._id
			# $scope.$apply ->
			# 	$scope.schema = res
			return res
		.then (doc)->
			socket.emit 'RunRequrlTest', doc
			
	$scope.editorOptions = do ->
		height:'100%'
		mode: 'text/x-coffeescript'
		autoMatchParens: true
		textWrapping: true
		lineNumbers: true
		indentUnit: 4
		indentWithTabs: true
		theme: 'ambiance'
	$scope.themes = [
		'default'
		'3024-day'
		'3024-night'
		'ambiance'
		'base16-dark'
		'base16-light'
		'blackboard'
		'cobalt'
		'eclipse'
		'elegant'
		'erlang-dark'
		'lesser-dark'
		'mbo'
		'mdn-like'
		'midnight'
		'monokai'
		'neat'
		'neo'
		'night'
		'paraiso-dark'
		'paraiso-light'
		'pastel-on-dark'
		'rubyblue'
		'solarized dark'
		'solarized light'
		'the-matrix'
		'tomorrow-night-eighties'
		'twilight'
		'vibrant-ink'
		'xq-dark'
		'xq-light'
	]
]