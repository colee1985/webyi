# 模板控制器
ag.controller 'CodeFileCtrl', ['AppConfig', '$scope', 'CodeFile', '$state', '$stateParams', 'SocketConnect',
(app, $scope, CodeFile, $state, $stateParams, socket)->
	$scope.app = app
	app.active = 'codefile'

	if $state.is 'codefile.create'
		$scope.model = CodeFile.create()
	else if $state.is 'codefile.update'
		CodeFile.findById $stateParams._id
		.then (data)->
			throw data if data.error_code
			$scope.$apply ->
				$scope.model = data
		.fail (err)->
			$state.go 'codefile.create'
		.done()
	$scope.$on '$stateChangeSuccess', (event, toState, toParams, fromState, fromParams)->
		# console.log toState.name
		$state.reload()

	$scope.code_types = CodeFile.code_types
		
	$scope.save = ()->
		CodeFile.save $scope.model
		.then (res)->
			$state.go 'codefile.update',
				_id: res._id
			console.log res._id
			# $scope.$apply ->
			# 	$scope.schema = res
			return res
		.then (doc)->
			socket.emit 'GenerateCodeFile', doc
		.fail (err)->
			console.log err
		.done()

	$scope.aceLoaded = (_editor)->
		_editor.setFontSize 14
		_editor.getSession().setUseSoftTabs(false)
		_editor.getSession().setTabSize(4)
]