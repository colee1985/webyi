# 数据模型控制器
app.controller 'SchemaFormCtrl', ($scope, SchemaModel, $state)->

	$scope.schema = new SchemaModel()
		
	$scope.field_types = SchemaModel.field_types
	$scope.schemas = []

	$scope.addField = ->
		$scope.schema.addField()
		console.log $scope.schema, $scope.schema.get('fields')

	$scope.delField = (index)->
		$scope.schema.fields.splice index,1

	$scope.addEnum = (field)->
		field.enums.push
			value: ''
	$scope.delEnum = (field, index)->
		field.enums.splice index,1

	$scope.save = ()->
		SchemaModel.save $scope.schema
		.then (res)->
			$state.go 'schema.update',
				_id: res._id
			return res
		.then (doc)->
			socket.emit 'RunSchameTest', doc
		.fail (err)->
			console.log err
		.done()