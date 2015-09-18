(function() {
  var e, model, mongoose;

  mongoose = require("../utils/mongoose");

  model = require('../schemas/ClaimApply');

  try {
    mongoose.model('claim_apply', model);
  } catch (_error) {
    e = _error;
  }

  module.exports = mongoose.model('claim_apply');

}).call(this);
