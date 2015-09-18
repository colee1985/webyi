module.exports = function() {
  var Error, log4js, swig;
  log4js = require('log4js');
  Error = require('../utils/Error');
  swig = require('swig');
  swig.setFilter('requrlType', function(input) {
    var str;
    str = input.toLowerCase();
    if (str !== 'post' && str !== 'all') {
      return 'get';
    }
    return str;
  });
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
  swig.setFilter('fieldType', function(input, sub_schema) {
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
  swig.setFilter('fieldEnum', function(input) {
    var str, v, values, _i, _len;
    if (typeof input === 'object' && input.length > 0) {
      values = [];
      for (_i = 0, _len = input.length; _i < _len; _i++) {
        v = input[_i];
        values.push(v.value);
      }
      str = values.join('", "');
      str = '["' + str + '"]';
      return str;
    }
    return void 0;
  });
  swig.setFilter('actionParames', function(input) {
    var parames_str, v, _i, _len;
    if (typeof input === 'object' && input.length > 0) {
      parames_str = [];
      for (_i = 0, _len = input.length; _i < _len; _i++) {
        v = input[_i];
        parames_str.push(v.name);
      }
      return parames_str.join(', ');
    }
    return '';
  });
  swig.setFilter('fieldDefault', function(input, value_type) {
    if (!input) {
      return 'null';
    }
    if (value_type === 'String' && input.length > 0) {
      return "'" + input + "'";
    } else {
      return input;
    }
  });
  swig.setFilter('configIsDebug', function(input) {
    if (input) {
      return 'true';
    } else {
      return 'false';
    }
  });
  return swig;
};
