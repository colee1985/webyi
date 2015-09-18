# 数据模型控制器
ag.controller 'SchemaCtrl', ['AppConfig', '$scope', 'Schema', '$state', '$stateParams', 'SocketConnect',
(app, $scope, Schema, $state, $stateParams, socket)->
	$scope.app = app
	app.active = 'schema'
	if $state.is 'schema.create'
		$scope.schema = Schema.create()
	else if $state.is 'schema.update'
		Schema.findById $stateParams._id
		.then (data)->
			$scope.$apply ->
				$scope.schema = data
	$scope.$on '$stateChangeSuccess', (event, toState, toParams, fromState, fromParams)->
		# console.log toState.name
		$state.reload()
		
	$scope.field_types = Schema.field_types
	$scope.schemas = []
	Schema.getList()
	.then (docs)->
		$scope.$apply ->
			for doc in docs
				$scope.schemas.push doc.model_name
	$scope.addField = ->
		$scope.schema.fields.push new Schema.default_field()

	$scope.delField = (index)->
		$scope.schema.fields.splice index,1

	$scope.addEnum = (field)->
		field.enums.push
			value: ''
	$scope.delEnum = (field, index)->
		field.enums.splice index,1

	$scope.save = ()->
		Schema.save $scope.schema
		.then (res)->
			$state.go 'schema.update',
				_id: res._id
			return res
		.then (doc)->
			socket.emit 'RunSchameTest', doc
		.fail (err)->
			console.log err
		.done()
]