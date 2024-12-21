const { Schema, model } = require('mongoose');

const roleContext = new Schema({
  name: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  },
});

module.exports = model('RoleContext', roleContext)