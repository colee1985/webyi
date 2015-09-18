
define('WEBYI', function(require, exports, module) {

	var Site = require('routes/site');
	var router = new Site();
	Backbone.history.start({pushState : true});
});

$(document).ready(function () {
	// seajs.use('WEBYI');
});

var app = angular.module('WEBYI', ['ngSanitize', 'ui.router', 'ngMessages'])
.config(function($locationProvider, $urlRouterProvider) {
	// html5Mode需要服务端配合指向
	// $locationProvider.html5Mode(true).hashPrefix('!');
	$urlRouterProvider.otherwise("/app/list");
}).run(function($rootScope, $state, KtAuth){
	$rootScope.$state = $state;
	$rootScope.KtAuth = KtAuth;
});