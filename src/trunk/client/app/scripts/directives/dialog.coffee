# use:
# <dialog 
# 	title="选择地标"
# 	visible="{{show}}"
# 	on-cancel="show=false;"
# 	on-ok="show=false;methodInParentScope()"
# 	width="100%"
# 	height="250px"
# ></dialog>

# 此控件没有返回数据

ag.directive "dialog", factory = ->
	priority: 100
	templateUrl: "templates/dialog.html"
	replace: true
	transclude: true
	restrict: "E"
	scope:
		title: "@" #引用dialog标签title属性的值
		onOk: "&" #以wrapper function形式引用dialog标签的on-ok属性的内容
		onCancel: "&" #以wrapper function形式引用dialog标签的on-cancel属性的内容
		visible: "@" #引用dialog标签visible属性的值