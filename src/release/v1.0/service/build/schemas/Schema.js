var Q, mongoose, _SchemaField;

Q = require('q');

mongoose = require("../utils/mongoose");

_SchemaField = require("./_SchemaField");

module.exports = new mongoose.Schema({
  model_name: {
    type: String,
    "default": 'Test',
    intro: '模型名称'
  },
  table_name: {
    type: String,
    "default": null,
    intro: ''
  },
  fields: {
    type: [_SchemaField],
    "default": null,
    intro: ''
  },
  creater_id: {
    type: mongoose.Schema.Types.ObjectId,
    "default": null,
    intro: ''
  },
  app_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    "default": null,
    intro: ''
  },
  plan_status: {
    type: String,
    "default": null,
    intro: ''
  }
});
