# 单选按钮组指令
# use:
# <div co-radio="[{key:false, value:'关闭'},{key:true,value:'开启'}]" ng-model="config.debug"></div>	


ag.directive "coRadio", factory = ->
	priority: 100
	template: '
<div class="btn-group">
  <button class="btn" ng-class="{active:select==item.key}" ng-repeat="item in enums" ng-click="setRadio(item)">{{item.value}}</button>
</div>
	'
	replace: true
	transclude: true
	restrict: "AE"
	require: '?ngModel'
	scope:
		enums: "=coRadio" #引用dialog标签title属性的值
	link: (scope, element, attrs, ctrl)->
		if ctrl
			ctrl.$render = ->
				scope.select = ctrl.$modelValue
			scope.setRadio = (item)->
				scope.select = item.key
				ctrl.$setViewValue item.key