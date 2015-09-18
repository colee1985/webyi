(function() {
  var e, model, mongoose;

  mongoose = require("../utils/mongoose");

  model = require('../schemas/EnshrineLeaflet');

  try {
    mongoose.model('enshrine_leaflet', model);
  } catch (_error) {
    e = _error;
  }

  module.exports = mongoose.model('enshrine_leaflet');

}).call(this);
