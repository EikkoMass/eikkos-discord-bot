const { Schema, model } = require('mongoose');

const actionRowRole = new Schema({
  guildId: {
    type: String,
    required: true
  },
  roleId: {
    type: String,
    required: true
  },
  context: {
    type: Schema.Types.ObjectId
  },
  label: {
    type: String,
  },
  style: {
    type: Number
  }
});

module.exports = model('ActionRowRole', actionRowRole)