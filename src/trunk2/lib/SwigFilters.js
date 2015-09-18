var swig;
var _ = require('underscore');
swig = require('swig');
// 格式化请求类型
swig.setFilter('requrlType', function(input) {
	var str;
	str = input.toLowerCase();
	if (str !== 'post' && str !== 'all') {
		return 'get';
	}
	return str;
});
// 缩进与格式化代码
swig.setFilter('formatCode', function(input, number) {
	var i, indent, t_n, _i;
	t_n = '';
	for (i = _i = 1; 1 <= number ? _i <= number : _i >= number; i = 1 <= number ? ++_i : --_i) {
		t_n += '\t';
	}
	indent = function(js) {
		return js.replace(/(\\)?\n(?!\n)/g, function($0, $1) {
			if ($1) {
				return $0;
			} else {
				return '\n' + t_n;
			}
		});
	};
	return indent(input);
});
// 格式化mongoose字段类型
swig.setFilter('mongooseFieldType', function(input, sub_schema) {
	var str;
	str = input;
	if (input === 'Email') {
		str = 'String';
	}
	if (input === 'ObjectId') {
		str = 'mongoose.Schema.Types.ObjectId';
	}
	if (input === 'Mixed') {
		str = 'mongoose.Schema.Types.Mixed';
	}
	if (str === 'Array' && sub_schema && sub_schema.length > 0) {
		str = '[' + sub_schema + ']';
	}
	if (str === 'Object' && sub_schema && sub_schema.length > 0) {
		str = sub_schema;
	}
	return str;
});
// 格式化sequilize字段类型
swig.setFilter('sequilizeFieldType', function(input) {
	var types = require('./datatypes').types;
	var typeOutStr = '';
	_.each(types, function(type) {
		var length;
		if (input.match(type.name)) {
			typeOutStr = type.value;
			if (type.value === 'INTEGER') {
				length = input.match(/\(\d+\)/);
				typeOutStr += length ? length : '';
				if (input.match('unsigned')) {
					return typeOutStr += '.UNSIGNED';
				}
			}else if (type.value === 'ENUM') {
				length = input.match(/\(.+\)/);
				typeOutStr += length ? length : '';
			}
		}
	});
	return typeOutStr;
});
// 格式化sequilize字段默认值
swig.setFilter('sequilizeFieldDefault', function(input) {
	console.log(typeof(input));
	if(input && isNaN(input)===false){
		return input;
	}else if(input){
		return "'"+input+"'";
	}else {
		return 'null';
	}
});

module.exports = swig;
