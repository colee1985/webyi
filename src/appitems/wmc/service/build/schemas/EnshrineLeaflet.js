(function() {
  var Q, mongoose;

  Q = require('q');

  mongoose = require("../utils/mongoose");

  module.exports = new mongoose.Schema({
    enshriner_id: {
      type: mongoose.Schema.Types.ObjectId,
      "default": null,
      intro: '收藏者ID'
    },
    leaflet_id: {
      type: mongoose.Schema.Types.ObjectId,
      "default": null,
      intro: '关联宣传单ID'
    },
    create_time: {
      type: Date,
      "default": Date.now,
      intro: '创建时间'
    }
  });

}).call(this);
