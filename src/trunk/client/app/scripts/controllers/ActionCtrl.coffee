# URL请求控制器
ag.controller 'ActionCtrl', ['AppConfig', '$scope', 'Action', '$state', '$stateParams', 'SocketConnect',
(app, $scope, Action, $state, $stateParams, socket)->
	$scope.app = app
	app.active = 'action'

	if $state.is 'action.create'
		$scope.model = Action.create()
	else if $state.is 'action.update'
		Action.findById $stateParams._id
		.then (data)->
			throw data if data.error_code
			$scope.$apply ->
				$scope.model = data
		.fail (err)->
			$state.go 'action.create'
		.done()
	$scope.$on '$stateChangeSuccess', (event, toState, toParams, fromState, fromParams)->
		# console.log toState.name
		$state.reload()
		
	$scope.addParame = ()->
		$scope.model.parames.push new Action.getParame()
	$scope.delParame = (index)->
		$scope.model.parames.splice index,1

	$scope.save = ()->
		Action.save $scope.model
		.then (res)->
			$state.go 'action.update',
				_id: res._id
			console.log res._id
			# $scope.$apply ->
			# 	$scope.schema = res
			return res
		.then (doc)->
			socket.emit 'RunActionTest', doc
		.fail (err)->
			console.log err
		.done()

	$scope.aceLoaded = (_editor)->
		_editor.setFontSize 14
		_editor.getSession().setUseSoftTabs(false)
		_editor.getSession().setTabSize(4)
]