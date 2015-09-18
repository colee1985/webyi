
app.controller 'SiteIndexCtrl', ($scope, $element, WindowInfo)->

	project_path = 'E:/htdocs/Co-sumaitong/src/trunk5/'
	$scope.joinAppAndStart = ->
		StartApp.run project_path, (data)->
			$scope.$broadcast 'console:message', data
	# 创建模式
	$scope.createSchemas = ->
		CreateSequelize.createSchemas project_path, (data)->
			$scope.$broadcast 'console:message', data
	# 创建模型
	$scope.createModels = ->
		CreateSequelize.createModels project_path, (data)->
			$scope.$broadcast 'console:message', data
	# 创建路由
	$scope.createRouters = ->
		CreateSequelize.createRouters project_path, (data)->
			$scope.$broadcast 'console:message', data
	# 生成测试文件
	$scope.createModelTests = ->
		CreateSequelize.createModelTests project_path, (data)->
			$scope.$broadcast 'console:message', data
	# 运行测试用例
	# params: {file:'test/models/a.test.js', grep: 'models.xxx'}
	$scope.runTest = (params)->
		RunTest.run project_path, params, (data)->
			$scope.$broadcast 'console:message', data
	# 停止所有测试
	$scope.stopAllTest = ->
		RunTest.closeAll (data)->
			$scope.$broadcast 'console:message', data
	# 运行的项目列表
	$scope.running_list = _.keys(StartApp.services)
	# 测试用例列表
	RunTest.getTestTree(project_path).then (res)->
		$scope.$apply ->
			$scope.test_list = res
	