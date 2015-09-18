# 数据模式
app.factory 'SchemaModel', ()->
	Backbone.Model.extend
		defaults:
			fields: []
			modelName: 'qq'
			tableName: 'qq'
		addField: ->
			fields = @get 'fields'
			fields.push {}
			@set 'fields', fields
			@