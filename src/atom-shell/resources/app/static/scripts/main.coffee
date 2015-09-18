StartApp = require '../actions/StartApp'
CreateSequelize = require('../actions/CreateSequelize')
RunTest = require('../actions/RunTest')

app = angular.module("WEBYI", ["ngSanitize", "ui.router", "ngMessages"])
.config(($locationProvider, $urlRouterProvider) ->
	# html5Mode需要服务端配合指向
	# $locationProvider.html5Mode(true).hashPrefix('!');
	$urlRouterProvider.otherwise "/site/index"
).run(($rootScope, $state, CoAuth, WindowInfo) ->
	$rootScope.$state = $state
	$rootScope.CoAuth = CoAuth
	$rootScope.WindowInfo = WindowInfo
)