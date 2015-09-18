# 应用配置服务
ag.factory 'AppConfig', ['$compile', '$templateCache', '$rootScope', ($compile, $templateCache, $rootScope)->
	api_domain: '/api/'
	name: 'WEBYI'
	active: 'home'
	# templateUrl: "templates/navbar.html"
	# UI: ->
	# 	scope = $rootScope.$new()
	# 	html = $templateCache.get @templateUrl
	# 	$compile(html)(scope)

	# 取得当前登录用户ID
	getLoginerId: ->
		Q.fcall ->
			return '53a15d7648e4e96427b888db'
	# 取得当前项目ID
	getCurAppItemId: ->
		Q.fcall ->
			return window.localStorage.app_item_id
]