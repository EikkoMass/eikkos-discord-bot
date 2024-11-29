const {Schema, model} = require('mongoose');

const streamScheme = new Schema({
  title: {
    type: String
  },
  link: {
    type: String,
    required: true
  },
  priority: {
    type: Boolean
  }
});

module.exports = model('Stream', streamScheme);