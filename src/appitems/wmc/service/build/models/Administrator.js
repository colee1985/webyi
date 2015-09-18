(function() {
  var e, model, mongoose;

  mongoose = require("../utils/mongoose");

  model = require('../schemas/Administrator');

  try {
    mongoose.model('administrator', model);
  } catch (_error) {
    e = _error;
  }

  module.exports = mongoose.model('administrator');

}).call(this);
