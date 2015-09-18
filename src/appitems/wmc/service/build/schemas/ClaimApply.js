(function() {
  var Q, mongoose;

  Q = require('q');

  mongoose = require("../utils/mongoose");

  module.exports = new mongoose.Schema({
    leaflet_id: {
      type: mongoose.Schema.Types.ObjectId,
      "default": null,
      intro: '被认领的宣传单'
    },
    leaflet_title: {
      type: String,
      "default": null,
      intro: '宣传单的标题'
    },
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      "default": null,
      intro: '认领人ID'
    },
    nickname: {
      type: String,
      "default": null,
      intro: '认领人昵称'
    },
    create_time: {
      type: Date,
      "default": Date.now,
      intro: '创建时间'
    },
    apply_status: {
      type: Number,
      "enum": ["0", "1", "2"],
      "default": 0,
      intro: '申请状态，0未处理、1审核通过、2不通过'
    },
    update_time: {
      type: Date,
      "default": Date.now,
      intro: '状态修改时间'
    }
  });

}).call(this);
