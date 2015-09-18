# 数据模型服务
ag.factory 'Schema', ['AppConfig', 'toast', 'GlobalLoading', '$rootScope', (app, toast, GlobalLoading, $scope)->
	field_types = [
		'ObjectId'
		'String'
		'Number'
		'Date'
		'Array'
		'Email'
		'Mixed'
	]
	default_field = ->
		name: ''
		type: 'String'
		sub_schema: ''
		enums: []
		default: ''
		intro: ''

	model = ->
		model_name: ''
		table_name: ''
		fields:[new default_field()]
		creater_id: null
		app_item_id: null
		plan_status: 'inprogress'

	field_types: field_types
	default_field: default_field
	model: model
	_models: []
	create: ->
		new model()
	findById: (_id)->
		GlobalLoading.show()
		deferred = Q.defer()
		$.ajax
			type: 'GET'
			url: app.api_domain+'schema/findById'
			data:
				_id: _id
				time: (new Date()).getTime()
			dataType: 'JSON'
			success: (data)->
				deferred.resolve(data)
				GlobalLoading.hide()
			error: (reason)->
				toast.show reason
				deferred.reject(reason)
				GlobalLoading.hide()
		deferred.promise
	save: (model)->
		GlobalLoading.show()
		Q.all [ app.getLoginerId(), app.getCurAppItemId()]
		.then (res)->
			model.creater_id = res[0]
			model.app_item_id = res[1]
			deferred = Q.defer()
			$.ajax
				type: 'POST'
				url: app.api_domain+'schema/save'
				data:
					model: model
					time: (new Date()).getTime()
				dataType: 'JSON'
				success: (data)->
					deferred.resolve(data)
					GlobalLoading.hide()
				error: (reason)->
					deferred.reject(reason)
					GlobalLoading.hide()
			deferred.promise
	del: (_id)->
		GlobalLoading.show()
		deferred = Q.defer()
		$.ajax
			type: 'POST'
			url: app.api_domain+'schema/del'
			data:
				_id: _id
				time: (new Date()).getTime()
			dataType: 'JSON'
			success: (data)->
				deferred.resolve(data)
				GlobalLoading.hide()
			error: (reason)->
				deferred.reject(reason)
				GlobalLoading.hide()
		deferred.promise
	delByIndex: (index)->
		ths = @
		model = @_models[index]
		@del model._id
		.then (res)->
			$scope.$apply ->
				ths._models.splice index,1

	getList: ()->
		ths = @
		GlobalLoading.show()
		Q.all [ app.getLoginerId(), app.getCurAppItemId()]
		.then (res)->
			creater_id = res[0]
			app_item_id = res[1]
			deferred = Q.defer()
			$.ajax
				type: 'GET'
				url: app.api_domain+'schema/list'
				data:
					creater_id: creater_id
					app_item_id: app_item_id
					time: (new Date()).getTime()
				dataType: 'JSON'
				success: (data)->
					ths._models = data
					deferred.resolve(data)
					GlobalLoading.hide()
				error: (reason)->
					deferred.reject(reason)
					GlobalLoading.hide()
			deferred.promise
]