(function() {
  var e, model, mongoose;

  mongoose = require("../utils/mongoose");

  model = require('../schemas/Landmark');

  try {
    mongoose.model('landmark', model);
  } catch (_error) {
    e = _error;
  }

  module.exports = mongoose.model('landmark');

}).call(this);
