ag = angular.module "CoWebYi", [
	'CoWebYiTemplates'
	'ui.router'
	'pascalprecht.translate'
	'ui.codemirror'
	'ui.ace'
]
ag.config [
	'$locationProvider'
	'$translateProvider'
	'$urlRouterProvider'
	'$stateProvider'
	(
		$locationProvider
		$translateProvider
		$urlRouterProvider
		$stateProvider
	)->
		# i18n.initStrings($translateProvider)
		lang = "en"
		$translateProvider.preferredLanguage(lang)
		# 编辑器
		$stateProvider.state 'ide',
			url: '/ide'
			views:
				"sidebar":
					templateUrl: "templates/ide-sidebar.html"
				"container":
					templateUrl: "templates/ide-form.html"

		# 数据模型
		$stateProvider.state 'schema',
			url: '/schema'
			views:
				"sidebar":
					templateUrl: "templates/project-sidebar.html"
				"container":
					templateUrl: "templates/schema-form.html"
		$stateProvider.state 'schema.create',
			url: '/create'
			# views:
			# 	"site-container":
			# 		templateUrl: "templates/site/index.html",
			# 		controller: indexCtrl
		$stateProvider.state 'schema.update',
			url: '/update/:_id'
		# URL请求
		$stateProvider.state 'requrl',
			url: '/requrl'
			views:
				"sidebar":
					templateUrl: "templates/project-sidebar.html"
				"container":
					templateUrl: "templates/requrl-form.html"
		$stateProvider.state 'requrl.create',
			url: '/create'
		$stateProvider.state 'requrl.update',
			url: '/update/:_id'
		# ACTION请求
		$stateProvider.state 'action',
			url: '/action'
			views:
				"sidebar":
					templateUrl: "templates/project-sidebar.html"
				"container":
					templateUrl: "templates/action-form.html"
		$stateProvider.state 'action.create',
			url: '/create'
		$stateProvider.state 'action.update',
			url: '/update/:_id'

		# CodeFile请求
		$stateProvider.state 'codefile',
			url: '/codefile'
			views:
				"sidebar":
					templateUrl: "templates/project-sidebar.html"
				"container":
					templateUrl: "templates/codefile-form.html"
		$stateProvider.state 'codefile.create',
			url: '/create'
		$stateProvider.state 'codefile.update',
			url: '/update/:_id'

		# 项目列表
		$stateProvider.state 'appitem',
			url: '/appitem'
			views:
				"sidebar":
					templateUrl: "templates/app-item-sidebar.html"
				"container":
					templateUrl: "templates/app-item-form.html"
		$stateProvider.state 'appitem.create',
			url: '/create'
		$stateProvider.state 'appitem.update',
			url: '/update/:_id'

		$urlRouterProvider.otherwise '/appitem'
]