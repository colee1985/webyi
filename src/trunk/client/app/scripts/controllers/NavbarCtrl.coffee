# 导航控制
ag.controller 'NavbarCtrl', ['AppConfig', '$scope', (app, $scope)->
	$scope.app = app
]