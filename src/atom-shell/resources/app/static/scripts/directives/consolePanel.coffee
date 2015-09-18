###
控制台面板
<div console-panel name="message"></div>
示例：$scope.$broadcast 'console:message', '11111111111'
###

app.directive 'consolePanel', (FormatJsonView)->
	# require: ["^?form", "ngModel"]
	restrict: "AE"
	replace: true
	# templateUrl: "templates/directives/kt_radio.html"
	template: '<div></div>'
	# transclude: true,
	scope: true

	link: (scope, element, attrs, ctrl) ->
		$(element).css
			height:  '100%'
			overflow:'auto'
			background:'#101010'
			float: 'left'
			width: '55%'

		row_number = 0
		addData = (data) ->
			if typeof (data) is "object"
				# data = JSON.stringify(data)
				data = FormatJsonView data
			else data = ansi2html($('<div/>').text(data).html())  if typeof (data) is "string"
			log = undefined
			row_number++
			
			# var textNode = $(document.createTextNode(ansi2html(data)));
			if $(element).find(".log-line").length < 200
				log = $(document.createElement("div")).addClass("log-line").css(position: "relative")
			else
				log = $(element).find(".log-line:first").html("")
			log.appendTo element
			pre = $("<pre></pre>").css(
				paddingLeft: 55
				fontSize: 14
			).html(data).appendTo(log)
			$("<p>" + row_number + "</p>").css(
				position: "absolute"
				margin: 0
				textAlign: "right"
				paddingRight: 5
				left: 0
				width: 50
				top: 0
				bottom: 0
				background: "#292929"
			).prependTo log
			$(element).scrollTop $(element)[0].scrollHeight
		name = attrs.name||'console'
		# SocketConnect.on(name, addData)
		# # 销毁监听
		# scope.$on '$destroy', ->
		# 	SocketConnect.removeEventListener name, addData
		scope.$on 'console:'+name, (event, data)->
			addData data